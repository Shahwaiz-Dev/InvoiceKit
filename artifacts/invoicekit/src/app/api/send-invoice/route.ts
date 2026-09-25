import { getSession } from "@/lib/auth-session";
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { db } from "@workspace/db";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Basic email format guard (RFC-5322 simplified) */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * In-memory sliding-window rate limiter.
 * 10 emails per hour per user — prevents Resend API abuse.
 * For multi-instance prod deployments, replace with Upstash Redis.
 * Rule: security / server-after-nonblocking
 */
const emailRateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const WINDOW_MS = 60 * 60 * 1000; // 1 hour
  const LIMIT = 10;
  const now = Date.now();

  const entry = emailRateLimit.get(userId);
  if (!entry || now > entry.resetAt) {
    emailRateLimit.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: LIMIT - 1 };
  }
  if (entry.count >= LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  entry.count++;
  return { allowed: true, remaining: LIMIT - entry.count };
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit check before any heavy work
  const { allowed, remaining } = checkRateLimit(session.user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. You can send up to 10 invoices per hour." },
      {
        status: 429,
        headers: { "Retry-After": "3600" },
      },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { to, invoiceData, customMessage, pdfBase64 } = data as {
    to: string;
    invoiceData: Record<string, any>;
    customMessage?: string;
    pdfBase64?: string;
  };

  // Validate recipient email before hitting the Resend API
  if (!to || typeof to !== "string" || !EMAIL_REGEX.test(to.trim())) {
    return NextResponse.json(
      { error: "Invalid or missing recipient email address." },
      { status: 400 },
    );
  }

  if (!invoiceData || typeof invoiceData !== "object") {
    return NextResponse.json({ error: "Missing invoice data." }, { status: 400 });
  }

  try {
    const fromEmail = process.env.RESEND_FROM_EMAIL || "invoices@invoice-sync.com";
    const fromAddress = fromEmail.includes("<") ? fromEmail : `Invoice-Sync <${fromEmail}>`;

    // Generate unique share token and store public invoice record
    const shareToken = crypto.randomUUID();
    try {
      await db.collection("public_invoices").insertOne({
        shareToken,
        userId: session.user.id,
        invoiceData,
        pdfBase64: pdfBase64 || null,
        recipientEmail: to.trim(),
        createdAt: new Date(),
      });
    } catch (dbErr) {
      console.warn("Failed to store public invoice in database:", dbErr);
    }

    // Determine application base URL
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const baseUrl = host
      ? `${proto}://${host}`
      : (process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "https://www.invoice-sync.com");

    const downloadUrl = `${baseUrl}/api/invoices/download?token=${shareToken}`;
    const viewUrl = `${baseUrl}/invoices/view?token=${shareToken}`;

    const htmlContent = generateThemedEmailHtml(invoiceData, to.trim(), customMessage, downloadUrl, viewUrl);

    // Build email payload with optional PDF attachment
    const emailPayload: any = {
      from: fromAddress,
      to: [to.trim()],
      subject: `Invoice #${invoiceData.invoiceNumber || "0001"} from ${invoiceData.businessName || "Invoice-Sync"}`,
      html: htmlContent,
    };

    if (pdfBase64) {
      try {
        emailPayload.attachments = [
          {
            filename: `Invoice-${invoiceData.invoiceNumber || "0001"}.pdf`,
            content: Buffer.from(pdfBase64, "base64"),
          },
        ];
      } catch (attErr) {
        console.warn("Could not attach PDF file:", attErr);
      }
    }

    const { data: emailData, error } = await resend.emails.send(emailPayload);

    if (error) {
      console.warn("Resend email delivery notice:", error.message);
      
      // In development or sandbox mode, don't hard block testing if recipient is not verified in Resend sandbox
      if (process.env.NODE_ENV !== "production" || error.message.includes("testing emails to your own email")) {
        console.log(`[Dev Simulation] Invoice #${invoiceData.invoiceNumber || "0001"} dispatched to ${to.trim()}`);
        return NextResponse.json({
          success: true,
          simulated: true,
          message: `Invoice email simulated (Resend Sandbox notice: ${error.message})`,
          downloadUrl,
          viewUrl,
          remaining,
        });
      }

      let errorMsg = error.message;
      if (error.message.includes("domain is not verified")) {
        errorMsg = "Resend domain not verified. Please verify your sender domain on resend.com or use onboarding@resend.dev.";
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: emailData?.id, downloadUrl, viewUrl, remaining });
  } catch (err) {
    console.error("Send invoice error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function generateThemedEmailHtml(
  data: Record<string, any>, 
  recipientEmail: string, 
  customMessage?: string,
  downloadUrl: string = "https://www.invoice-sync.com",
  viewUrl: string = "https://www.invoice-sync.com"
): string {
  const currency = data.currency || "USD";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
  const invoiceNumber = data.invoiceNumber || "0001";
  const businessName = data.businessName || "Your Business";
  const clientName = data.clientName || "Valued Client";
  const totalAmount = data.totalAmount || "0.00";
  const dueDate = data.dueDate || "Upon receipt";
  const issueDate = data.issueDate || new Date().toISOString().split("T")[0];

  const lineItems = Array.isArray(data.lineItems) ? data.lineItems : [];
  const lineItemsHtml = lineItems.length > 0
    ? lineItems.map((item: any, i: number) => {
        const qty = Number(item.quantity) || 1;
        const price = Number(item.unitPrice) || 0;
        const amount = qty * price;
        const bg = i % 2 === 0 ? "#ffffff" : "#f8fafc";
        return `
          <tr style="background-color: ${bg}; border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 14px; font-size: 13px; color: #1e293b; font-weight: 500;">
              ${item.description || "Line item"}
            </td>
            <td style="padding: 12px 14px; font-size: 13px; color: #64748b; text-align: center;">
              ${qty}
            </td>
            <td style="padding: 12px 14px; font-size: 13px; color: #64748b; text-align: right;">
              ${currencySymbol}${price.toFixed(2)}
            </td>
            <td style="padding: 12px 14px; font-size: 13px; color: #091135; font-weight: 600; text-align: right;">
              ${currencySymbol}${amount.toFixed(2)}
            </td>
          </tr>
        `;
      }).join("")
    : `
      <tr>
        <td colspan="4" style="padding: 18px 14px; font-size: 13px; color: #64748b; text-align: center; font-style: italic;">
          Invoice for professional services
        </td>
      </tr>
    `;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invoice #${invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);">
          
          <!-- Top Accent Gradient Bar matching website theme -->
          <tr>
            <td style="height: 5px; background: linear-gradient(90deg, #0f77ff 0%, #3b82f6 50%, #6366f1 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 28px 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    ${data.logoUrl ? `
                      <img src="${data.logoUrl}" alt="${businessName}" style="max-height: 48px; max-width: 180px; object-fit: contain; display: block;" />
                    ` : `
                      <div style="font-size: 20px; font-weight: 700; color: #091135; letter-spacing: -0.5px;">
                        ${businessName}
                      </div>
                    `}
                  </td>
                  <td align="right" valign="middle">
                    <span style="display: inline-block; background-color: #eff6ff; color: #0f77ff; border: 1px solid #dbeafe; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px;">
                      INVOICE #${invoiceNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Amount Card -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 1px solid #dbeafe; border-radius: 12px; padding: 22px 24px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 6px;">
                      Amount Due
                    </div>
                    <div style="font-size: 32px; font-weight: 800; color: #091135; letter-spacing: -0.5px; line-height: 1.1;">
                      ${currencySymbol}${totalAmount}
                    </div>
                    <div style="margin-top: 10px; font-size: 13px; color: #475569; display: flex; align-items: center; gap: 6px;">
                      <span style="display: inline-block; width: 7px; height: 7px; background-color: #0f77ff; border-radius: 50%;"></span>
                      <span>Payment due by <strong>${dueDate}</strong></span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Personalized Message (if provided) -->
          ${customMessage ? `
          <tr>
            <td style="padding: 16px 32px 0;">
              <div style="background-color: #f8fafc; border-left: 3px solid #0f77ff; border-radius: 0 8px 8px 0; padding: 14px 16px; font-size: 13px; color: #334155; line-height: 1.6;">
                ${customMessage.replace(/\n/g, "<br />")}
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Billing Info Grid (From / To) -->
          <tr>
            <td style="padding: 24px 32px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- From -->
                  <td width="48%" valign="top" style="padding-right: 12px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 6px;">
                      Billed From
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">
                      ${businessName}
                    </div>
                    ${data.businessAddress ? `<div style="font-size: 12px; color: #64748b; line-height: 1.5; white-space: pre-line;">${data.businessAddress}</div>` : ""}
                    ${data.businessEmail ? `<div style="font-size: 12px; color: #0f77ff; margin-top: 2px;">${data.businessEmail}</div>` : ""}
                    ${data.taxId ? `<div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Tax ID: ${data.taxId}</div>` : ""}
                  </td>
                  <!-- To -->
                  <td width="48%" valign="top" style="padding-left: 12px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #94a3b8; margin-bottom: 6px;">
                      Billed To
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a; margin-bottom: 2px;">
                      ${clientName}
                    </div>
                    ${data.clientAddress ? `<div style="font-size: 12px; color: #64748b; line-height: 1.5; white-space: pre-line;">${data.clientAddress}</div>` : ""}
                    <div style="font-size: 12px; color: #0f77ff; margin-top: 2px;">${recipientEmail}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Meta Row: Issue Date / Terms -->
          <tr>
            <td style="padding: 0 32px 18px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 8px; padding: 10px 16px; font-size: 12px; color: #64748b;">
                <tr>
                  <td><strong>Issue Date:</strong> ${issueDate}</td>
                  <td align="right"><strong>Terms:</strong> ${data.terms || "Due on receipt"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Line Items Table -->
          <tr>
            <td style="padding: 0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                    <th align="left" style="padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                      Description
                    </th>
                    <th align="center" width="50" style="padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                      Qty
                    </th>
                    <th align="right" width="80" style="padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                      Rate
                    </th>
                    <th align="right" width="90" style="padding: 10px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Financial Breakdown Summary -->
          <tr>
            <td style="padding: 16px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="55%"></td>
                  <td width="45%">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 13px; color: #64748b;">
                      ${Number(data.taxRate) > 0 ? `
                        <tr>
                          <td style="padding: 4px 0;">Tax (${data.taxRate}%):</td>
                          <td align="right" style="padding: 4px 0; font-weight: 600; color: #1e293b;">
                            +${currencySymbol}${((Number(data.taxRate) / 100) * (Number(totalAmount) || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ` : ""}
                      ${Number(data.discount) > 0 ? `
                        <tr>
                          <td style="padding: 4px 0;">Discount (${data.discount}%):</td>
                          <td align="right" style="padding: 4px 0; font-weight: 600; color: #10b981;">
                            -${currencySymbol}${((Number(data.discount) / 100) * (Number(totalAmount) || 0)).toFixed(2)}
                          </td>
                        </tr>
                      ` : ""}
                      ${Number(data.shipping) > 0 ? `
                        <tr>
                          <td style="padding: 4px 0;">Shipping:</td>
                          <td align="right" style="padding: 4px 0; font-weight: 600; color: #1e293b;">
                            +${currencySymbol}${Number(data.shipping).toFixed(2)}
                          </td>
                        </tr>
                      ` : ""}
                      <tr>
                        <td style="padding: 8px 0 0; font-size: 15px; font-weight: 700; color: #091135; border-top: 2px solid #0f77ff;">
                          Total Balance:
                        </td>
                        <td align="right" style="padding: 8px 0 0; font-size: 17px; font-weight: 800; color: #0f77ff; border-top: 2px solid #0f77ff;">
                          ${currencySymbol}${totalAmount}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Notes Section (if present) -->
          ${data.notes ? `
          <tr>
            <td style="padding: 0 32px 24px;">
              <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 8px; padding: 14px 16px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #78716c; margin-bottom: 4px;">
                  Notes / Payment Terms
                </div>
                <div style="font-size: 12px; color: #44403c; line-height: 1.5; white-space: pre-line;">
                  ${data.notes}
                </div>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- Action Button (Download) -->
          <tr>
            <td align="center" style="padding: 8px 32px 32px;">
              <a href="${downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #0f77ff 0%, #2563eb 100%); color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 36px; border-radius: 10px; box-shadow: 0 4px 14px rgba(15, 119, 255, 0.25); letter-spacing: 0.2px;">
                Download Invoice
              </a>
            </td>
          </tr>


          <!-- Sleek Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b; font-weight: 500;">
                Generated with <strong style="color: #091135;">Invoice-Sync</strong> • Data-grade invoicing for modern operators
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © 2026 invoice-sync.com. All rights reserved. Zero watermarks, pure speed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

