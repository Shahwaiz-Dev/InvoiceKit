import { getSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { isAPIError } from "better-auth/api";
import { z } from "zod";
import { db, ObjectId } from "@workspace/db";

const deleteUserBodySchema = z
  .object({
    callbackURL: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
  })
  .strict();

function normalizeAuthId(rawId: unknown): string | null {
  if (typeof rawId === "string" && rawId.length > 0) {
    return rawId;
  }

  if (!rawId || typeof rawId !== "object") {
    return null;
  }

  const candidate = rawId as {
    buffer?: Uint8Array | Record<string, number>;
    toHexString?: () => string;
    toString?: () => string;
  };

  if (typeof candidate.toHexString === "function") {
    const hex = candidate.toHexString();
    return hex && hex !== "[object Object]" ? hex : null;
  }

  if (candidate.buffer) {
    const bufferData =
      candidate.buffer instanceof Uint8Array
        ? candidate.buffer
        : Object.values(candidate.buffer);
    return Buffer.from(bufferData).toString("hex");
  }

  if (typeof candidate.toString === "function") {
    const stringified = candidate.toString();
    return stringified && stringified !== "[object Object]"
      ? stringified
      : null;
  }

  return null;
}

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof deleteUserBodySchema> | undefined;
  const rawBody = await req.text();

  if (rawBody) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsedBody = deleteUserBodySchema.safeParse(parsedJson);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid delete request payload" },
        { status: 400 },
      );
    }

    body = parsedBody.data;
  }

  const normalizedUserId = normalizeAuthId(session.user.id);
  if (!normalizedUserId) {
    console.error(
      "[DELETE ACCOUNT] Failed to normalize session user id:",
      session.user.id,
    );
    return NextResponse.json(
      { error: "Invalid user session identifier" },
      { status: 400 },
    );
  }

  console.log(
    `[DELETE ACCOUNT] Initializing wipe for user: ${normalizedUserId}`,
  );

  try {
    if (body?.token || body?.callbackURL) {
      await auth.api.deleteUser({
        headers: req.headers,
        body: body ?? {},
      });
    } else {
      if (body?.password) {
        return NextResponse.json(
          {
            error:
              "Please sign in again before deleting your account. Password-based deletion is not supported in this flow.",
          },
          { status: 400 },
        );
      }

      const freshAgeSeconds =
        (auth as { options?: { session?: { freshAge?: number } } }).options
          ?.session?.freshAge ?? 3600 * 24;

      if (freshAgeSeconds !== 0) {
        const createdAt = new Date(session.session.createdAt).getTime();
        if (Date.now() - createdAt >= freshAgeSeconds * 1000) {
          return NextResponse.json(
            {
              error:
                "Your session is too old to delete this account. Please sign in again and retry.",
            },
            { status: 400 },
          );
        }
      }

      const userObjectId = ObjectId.isValid(normalizedUserId)
        ? new ObjectId(normalizedUserId)
        : null;
      const userIdVariants: unknown[] = [normalizedUserId];
      if (userObjectId) {
        userIdVariants.push(userObjectId);
      }
      if (session.user.id && typeof session.user.id === "object") {
        userIdVariants.push(session.user.id);
      }

      await db.collection("invoices").deleteMany({
        userId: { $in: userIdVariants },
      });
      await db.collection("userSettings").deleteMany({
        userId: { $in: userIdVariants },
      });
      await db.collection("session").deleteMany({
        userId: { $in: userIdVariants },
      });
      await db.collection("account").deleteMany({
        userId: { $in: userIdVariants },
      });
      const deletedUser = userObjectId
        ? await db.collection("user").deleteOne({ _id: userObjectId })
        : null;
      if (!deletedUser || deletedUser.deletedCount === 0) {
        await db.collection("user").deleteOne({ _id: normalizedUserId as any });
      }
    }

    console.log(
      `[DELETE ACCOUNT] Successfully wiped data for user: ${normalizedUserId}`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE ACCOUNT] Error during account deletion:", error);

    if (isAPIError(error)) {
      const status = typeof error.status === "number" ? error.status : 400;
      return NextResponse.json(
        { error: error.message || "Failed to delete account." },
        { status },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete account. Please try again or contact support.",
      },
      { status: 500 },
    );
  }
}
