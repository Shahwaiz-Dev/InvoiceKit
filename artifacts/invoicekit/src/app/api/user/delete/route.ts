import { getSession } from "@/lib/auth-session";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db, ObjectId } from "@workspace/db";
import { normalizeAuthId } from "@/lib/server-utils";
import { handleApiError, badRequestResponse, unauthorizedResponse } from "@/lib/api-errors";

const deleteUserBodySchema = z
  .object({
    callbackURL: z.string().optional(),
    password: z.string().optional(),
    token: z.string().optional(),
  })
  .strict();

export async function POST(req: Request) {
  const session = await getSession();

  if (!session) {
    return unauthorizedResponse();
  }

  let body: z.infer<typeof deleteUserBodySchema> | undefined;
  const rawBody = await req.text();

  if (rawBody) {
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      return badRequestResponse("Invalid JSON body");
    }

    const parsedBody = deleteUserBodySchema.safeParse(parsedJson);
    if (!parsedBody.success) {
      return badRequestResponse("Invalid delete request payload");
    }

    body = parsedBody.data;
  }

  const normalizedUserId = normalizeAuthId(session.user.id);
  if (!normalizedUserId) {
    console.error(
      "[DELETE ACCOUNT] Failed to normalize session user id:",
      session.user.id,
    );
    return badRequestResponse("Invalid user session identifier");
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
        return badRequestResponse(
          "Please sign in again before deleting your account. Password-based deletion is not supported in this flow."
        );
      }

      const freshAgeSeconds =
        (auth as { options?: { session?: { freshAge?: number } } }).options
          ?.session?.freshAge ?? 3600 * 24;

      if (freshAgeSeconds !== 0) {
        const createdAt = new Date(session.session.createdAt).getTime();
        if (Date.now() - createdAt >= freshAgeSeconds * 1000) {
          return badRequestResponse(
            "Your session is too old to delete this account. Please sign in again and retry."
          );
        }
      }

      const userObjectId = ObjectId.isValid(normalizedUserId)
        ? new ObjectId(normalizedUserId)
        : null;
      const userIdVariants: (string | ObjectId)[] = [normalizedUserId];
      if (userObjectId) {
        userIdVariants.push(userObjectId);
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
        await db.collection("user").deleteOne({ _id: normalizedUserId });
      }
    }

    console.log(
      `[DELETE ACCOUNT] Successfully wiped data for user: ${normalizedUserId}`,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
