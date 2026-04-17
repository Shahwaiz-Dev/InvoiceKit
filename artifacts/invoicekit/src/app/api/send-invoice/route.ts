import { getSession } from "@/lib/auth-session";
import { Resend } from "resend";
import { NextResponse } from "next/server";

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

  const { to, invoiceData } = data as { to: string; invoiceData: Record<string, string> };

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
    const { data: emailData, error } = await resend.emails.send({
      from: "InvoiceKit <invoices@invoicekit.app>",
      to: [to.trim()],
      subject: `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.businessName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h1 style="color: #111827; font-size: 24px; font-weight: bold; margin-bottom: 16px;">New Invoice Received</h1>
          <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">
            You have received a new invoice from <strong>${invoiceData.businessName}</strong>.
          </p>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
            <p style="margin: 4px 0;"><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}</p>
            <p style="margin: 4px 0;"><strong>Amount Due:</strong> ${invoiceData.currency} ${invoiceData.totalAmount || ""}</p>
            <p style="margin: 4px 0;"><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
          </div>
          <p style="color: #4b5563; font-size: 14px;">
            Please contact ${invoiceData.businessEmail || "the sender"} if you have any questions.
          </p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            Sent via <a href="https://invoicekit.app" style="color: #4f46e5; text-decoration: none;">InvoiceKit</a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: emailData?.id, remaining });
  } catch (err) {
    console.error("Send invoice error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
