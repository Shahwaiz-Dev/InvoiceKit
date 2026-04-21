import { getSession } from "@/lib/auth-session";
import { db, ObjectId } from "@workspace/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError, unauthorizedResponse, badRequestResponse, notFoundResponse } from "@/lib/api-errors";

const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  date: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.any()).optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "canceled"]).optional(),
  total: z.number().optional(),
  tax: z.number().optional(),
  discount: z.number().optional(),
  currency: z.string().optional(),
}).strict();

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const { id } = await params;
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return badRequestResponse("Invalid ID format");
    }

    const invoice = await db.collection("invoices").findOne({
      _id: objectId,
      userId: session.user.id,
    });

    if (!invoice) {
        return notFoundResponse("Invoice not found");
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const { id } = await params;
    const body = await req.json();

    const validatedBody = updateInvoiceSchema.safeParse(body);
    if (!validatedBody.success) {
      return badRequestResponse("Invalid update data", "VALIDATION_ERROR");
    }

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return badRequestResponse("Invalid ID format");
    }

    const result = await db.collection("invoices").findOneAndUpdate(
      { _id: objectId, userId: session.user.id },
      { $set: { ...validatedBody.data, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return notFoundResponse("Invoice not found");
    }

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const { id } = await params;

    let objectId: ObjectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return badRequestResponse("Invalid ID format");
    }

    const result = await db
      .collection("invoices")
      .deleteOne({ _id: objectId, userId: session.user.id });

    if (result.deletedCount === 0) {
      return notFoundResponse("Invoice not found");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
