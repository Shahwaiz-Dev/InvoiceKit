import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import { db } from "@workspace/db";

// Mocks must be declared before importing the route
vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      deleteUser: vi.fn(),
    },
    options: {
      session: {
        freshAge: 3600 * 24,
      },
    },
  },
}));

vi.mock("@/lib/server-utils", () => ({
  normalizeAuthId: vi.fn(),
}));

vi.mock("@/lib/api-errors", () => ({
  handleApiError: vi.fn((error: unknown) => ({
    body: { error: "Internal error" },
    status: 500,
  })),
  badRequestResponse: vi.fn((message: string) => ({
    body: { error: message },
    status: 400,
  })),
  unauthorizedResponse: vi.fn(() => ({
    body: { error: "Unauthorized" },
    status: 401,
  })),
}));

import { POST } from "@/app/api/user/delete/route";
import { getSession } from "@/lib/auth-session";
import { normalizeAuthId } from "@/lib/server-utils";
import { unauthorizedResponse, badRequestResponse } from "@/lib/api-errors";

const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";
const NON_OBJECT_ID = "user_abc123_nonhex";

function makeRequest(body?: unknown): Request {
  return {
    text: vi.fn().mockResolvedValue(body !== undefined ? JSON.stringify(body) : ""),
    headers: new Headers(),
  } as unknown as Request;
}

function makeSession(userId: string, createdAt?: Date) {
  return {
    user: { id: userId },
    session: { createdAt: (createdAt ?? new Date()).toISOString() },
  };
}

function makeCollectionMock() {
  return {
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    updateOne: vi.fn().mockResolvedValue({ matchedCount: 1 }),
  };
}

describe("POST /api/user/delete", () => {
  let collectionMock: ReturnType<typeof makeCollectionMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    collectionMock = makeCollectionMock();
    vi.mocked(db.collection).mockReturnValue(collectionMock as any);
  });

  describe("authentication checks", () => {
    it("returns 401 when no session exists", async () => {
      vi.mocked(getSession).mockResolvedValue(null);
      const req = makeRequest();
      await POST(req);
      expect(unauthorizedResponse).toHaveBeenCalledOnce();
    });

    it("returns 400 when normalizeAuthId returns null", async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession("invalid-id") as any);
      vi.mocked(normalizeAuthId).mockReturnValue(null);
      const req = makeRequest();
      await POST(req);
      expect(badRequestResponse).toHaveBeenCalledWith(
        "Invalid user session identifier"
      );
    });
  });

  describe("request body validation", () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(makeSession(VALID_OBJECT_ID) as any);
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
    });

    it("returns 400 for malformed JSON body", async () => {
      const req = {
        text: vi.fn().mockResolvedValue("{invalid json"),
        headers: new Headers(),
      } as unknown as Request;
      await POST(req);
      expect(badRequestResponse).toHaveBeenCalledWith("Invalid JSON body");
    });

    it("returns 400 for unknown fields in body (strict schema)", async () => {
      const req = makeRequest({ unknownField: "value" });
      await POST(req);
      expect(badRequestResponse).toHaveBeenCalledWith(
        "Invalid delete request payload"
      );
    });

    it("returns 400 when password is provided without token/callbackURL", async () => {
      const req = makeRequest({ password: "mypassword" });
      await POST(req);
      expect(badRequestResponse).toHaveBeenCalledWith(
        expect.stringContaining("Password-based deletion is not supported")
      );
    });

    it("accepts empty body without errors", async () => {
      const req = makeRequest();
      const response = await POST(req);
      // Should not call badRequestResponse for empty body
      expect(badRequestResponse).not.toHaveBeenCalled();
    });
  });

  describe("user deletion with $in query (core change)", () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(makeSession(VALID_OBJECT_ID) as any);
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
    });

    it("calls deleteOne with $in containing both string and ObjectId variants for valid ObjectId user", async () => {
      const req = makeRequest();
      await POST(req);

      expect(collectionMock.deleteOne).toHaveBeenCalledOnce();
      const callArg = collectionMock.deleteOne.mock.calls[0][0];
      expect(callArg).toHaveProperty("_id.$in");
      const inValues = callArg._id.$in;
      // Should have both string and ObjectId variants
      expect(inValues).toHaveLength(2);
      expect(inValues[0]).toBe(VALID_OBJECT_ID);
      expect(inValues[1]).toBeInstanceOf(ObjectId);
      expect(inValues[1].toString()).toBe(VALID_OBJECT_ID);
    });

    it("calls deleteOne with $in containing only string variant for non-ObjectId user", async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession(NON_OBJECT_ID) as any);
      vi.mocked(normalizeAuthId).mockReturnValue(NON_OBJECT_ID);

      const req = makeRequest();
      await POST(req);

      expect(collectionMock.deleteOne).toHaveBeenCalledOnce();
      const callArg = collectionMock.deleteOne.mock.calls[0][0];
      expect(callArg).toHaveProperty("_id.$in");
      const inValues = callArg._id.$in;
      // Should have only the string variant (not a valid ObjectId hex)
      expect(inValues).toHaveLength(1);
      expect(inValues[0]).toBe(NON_OBJECT_ID);
    });

    it("calls deleteOne exactly once (not fallback double-call)", async () => {
      const req = makeRequest();
      await POST(req);
      expect(collectionMock.deleteOne).toHaveBeenCalledOnce();
    });

    it("also deletes from invoices, userSettings, session, and account collections", async () => {
      const req = makeRequest();
      await POST(req);

      const collectionNames = vi
        .mocked(db.collection)
        .mock.calls.map((c) => c[0]);
      expect(collectionNames).toContain("invoices");
      expect(collectionNames).toContain("userSettings");
      expect(collectionNames).toContain("session");
      expect(collectionNames).toContain("account");
      expect(collectionNames).toContain("user");
    });

    it("calls deleteMany on invoices, userSettings, session, and account with $in userId variants", async () => {
      const req = makeRequest();
      await POST(req);

      expect(collectionMock.deleteMany).toHaveBeenCalledTimes(4);
      for (const call of collectionMock.deleteMany.mock.calls) {
        expect(call[0]).toHaveProperty("userId.$in");
      }
    });

    it("returns success response after deletion", async () => {
      const req = makeRequest();
      const response = await POST(req);
      expect(response).toMatchObject({ body: { success: true }, status: 200 });
    });
  });

  describe("token/callbackURL-based deletion path", () => {
    beforeEach(() => {
      vi.mocked(getSession).mockResolvedValue(makeSession(VALID_OBJECT_ID) as any);
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
    });

    it("delegates to auth.api.deleteUser when token is provided", async () => {
      const { auth } = await import("@/lib/auth");
      const req = makeRequest({ token: "some-token" });
      await POST(req);
      expect(auth.api.deleteUser).toHaveBeenCalledOnce();
      // Should NOT call db.collection deleteOne/deleteMany directly
      expect(collectionMock.deleteOne).not.toHaveBeenCalled();
    });

    it("delegates to auth.api.deleteUser when callbackURL is provided", async () => {
      const { auth } = await import("@/lib/auth");
      const req = makeRequest({ callbackURL: "https://example.com/callback" });
      await POST(req);
      expect(auth.api.deleteUser).toHaveBeenCalledOnce();
    });
  });

  describe("fresh session check", () => {
    it("returns 400 when session is too old (exceeds freshAge)", async () => {
      // Session created 2 days ago (beyond default 24h freshAge)
      const oldDate = new Date(Date.now() - 2 * 24 * 3600 * 1000);
      vi.mocked(getSession).mockResolvedValue(
        makeSession(VALID_OBJECT_ID, oldDate) as any
      );
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
      const req = makeRequest();
      await POST(req);
      expect(badRequestResponse).toHaveBeenCalledWith(
        expect.stringContaining("session is too old")
      );
    });

    it("allows deletion when session is fresh (within freshAge)", async () => {
      const freshDate = new Date(Date.now() - 60 * 1000); // 1 minute ago
      vi.mocked(getSession).mockResolvedValue(
        makeSession(VALID_OBJECT_ID, freshDate) as any
      );
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
      const req = makeRequest();
      await POST(req);
      expect(badRequestResponse).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("calls handleApiError when db throws", async () => {
      vi.mocked(getSession).mockResolvedValue(makeSession(VALID_OBJECT_ID) as any);
      vi.mocked(normalizeAuthId).mockReturnValue(VALID_OBJECT_ID);
      collectionMock.deleteMany.mockRejectedValue(new Error("DB error"));
      const { handleApiError } = await import("@/lib/api-errors");

      const req = makeRequest();
      await POST(req);
      expect(handleApiError).toHaveBeenCalled();
    });
  });
});