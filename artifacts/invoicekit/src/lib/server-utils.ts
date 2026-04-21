import { ObjectId } from "@workspace/db"

/**
 * Normalizes an identifier that could be a string, an ObjectId, or a binary Buffer.
 * Standardizes it to its 24-char hex string representation.
 */
export function normalizeAuthId(rawId: unknown): string | null {
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
