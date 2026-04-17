import { getSession } from "@/lib/auth-session";
import { db } from "@workspace/db";
import { NextResponse } from "next/server";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const ALLOWED_FIELDS = ["businessName", "businessEmail", "businessAddress", "logoUrl"] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const settings = await db
    .collection("userSettings")
    .findOne({ userId: session.user.id });

  if (!settings) return NextResponse.json(null);

  // Exclude internal mongo _id field
  const { _id, ...rest } = settings;
  return NextResponse.json(rest);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Whitelist allowed fields — never spread raw body into DB
  const update: Record<string, string> = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body && typeof body[key] === "string") {
      update[key] = body[key] as string;
    }
  }

  // Server-side logo validation (client-side check is bypassable)
  if (update.logoUrl && update.logoUrl.startsWith("data:")) {
    const mimeMatch = update.logoUrl.match(/^data:([^;]+);base64,/);
    if (!mimeMatch || !ALLOWED_MIME_TYPES.has(mimeMatch[1])) {
      return NextResponse.json(
        { error: "Invalid image format. Only PNG, JPEG, WEBP, and GIF are allowed." },
        { status: 415 },
      );
    }
    // Estimate decoded byte size from base64 length
    const base64Data = update.logoUrl.split(",")[1] ?? "";
    const estimatedBytes = Math.ceil((base64Data.length * 3) / 4);
    if (estimatedBytes > MAX_LOGO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Logo must be 2 MB or smaller." },
        { status: 413 },
      );
    }
  }

  await db.collection("userSettings").updateOne(
    { userId: session.user.id },
    { $set: { ...update, userId: session.user.id, updatedAt: new Date() } },
    { upsert: true },
  );

  return NextResponse.json({ success: true });
}
