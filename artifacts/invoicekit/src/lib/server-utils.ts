import { ObjectId } from "@workspace/db"

/**
 * Safely converts a string to an ObjectId.
 * Returns null if the string is invalid.
 * This should ONLY be used in server-side code (API routes, Server Components).
 */
export function safeObjectId(id: string | null | undefined): ObjectId | null {
  if (!id || !ObjectId.isValid(id)) return null;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}
