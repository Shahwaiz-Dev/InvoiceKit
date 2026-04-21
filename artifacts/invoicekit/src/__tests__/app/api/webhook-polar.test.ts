import { describe, it, expect, vi, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import { db } from "@workspace/db";

// Capture the onPayload callback so tests can invoke it directly
let capturedOnPayload: ((payload: any) => Promise<void>) | null = null;

vi.mock("@polar-sh/nextjs", () => ({
  Webhooks: vi.fn(({ onPayload }: { webhookSecret: string; onPayload: (payload: any) => Promise<void> }) => {
    capturedOnPayload = onPayload;
    return vi.fn().mockResolvedValue({ status: 200, body: "ok" });
  }),
}));

vi.mock("@/lib/plans", () => ({
  getPlanFromProductId: vi.fn((productId: string) => {
    if (productId === "prod_pro") return "pro";
    if (productId === "prod_starter") return "starter";
    return "free";
  }),
}));

vi.mock("@/lib/server-utils", () => ({
  safeObjectId: vi.fn((id: string) => {
    try {
      if (id && ObjectId.isValid(id) && id.length === 24) {
        return new ObjectId(id);
      }
    } catch {
      // ignore
    }
    return null;
  }),
  normalizeAuthId: vi.fn((id: unknown) => (typeof id === "string" ? id : null)),
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
}));

import { POST } from "@/app/api/webhook/polar/route";
import { Webhooks } from "@polar-sh/nextjs";
import { handleApiError } from "@/lib/api-errors";

const VALID_USER_ID = "507f1f77bcf86cd799439011";

function makeNextRequest(): any {
  return {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    text: vi.fn().mockResolvedValue("{}"),
  };
}

function makeCollectionMock() {
  return {
    deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    deleteMany: vi.fn().mockResolvedValue({ deletedCount: 1 }),
    updateOne: vi.fn().mockResolvedValue({ matchedCount: 1 }),
  };
}

describe("POST /api/webhook/polar", () => {
  const originalEnv = process.env.POLAR_WEBHOOK_SECRET;
  let collectionMock: ReturnType<typeof makeCollectionMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedOnPayload = null;
    collectionMock = makeCollectionMock();
    vi.mocked(db.collection).mockReturnValue(collectionMock as any);
    process.env.POLAR_WEBHOOK_SECRET = "test-secret-key";
  });

  afterEach(() => {
    process.env.POLAR_WEBHOOK_SECRET = originalEnv;
  });

  describe("webhook secret validation", () => {
    it("returns 500 when POLAR_WEBHOOK_SECRET is not set", async () => {
      delete process.env.POLAR_WEBHOOK_SECRET;
      const req = makeNextRequest();
      const response = await POST(req);
      expect(response).toMatchObject({ status: 500 });
      expect(Webhooks).not.toHaveBeenCalled();
    });

    it("returns 500 with error message when secret is missing", async () => {
      delete process.env.POLAR_WEBHOOK_SECRET;
      const req = makeNextRequest();
      const response = await POST(req);
      expect(response.body).toMatchObject({ error: expect.any(String) });
    });

    it("initializes Webhooks with the secret when set", async () => {
      const req = makeNextRequest();
      await POST(req);
      expect(Webhooks).toHaveBeenCalledWith(
        expect.objectContaining({ webhookSecret: "test-secret-key" })
      );
    });

    it("calls the returned handler with the request (NextRequest compatible)", async () => {
      const req = makeNextRequest();
      await POST(req);
      // The handler returned by Webhooks() should have been called with req
      const mockHandler = vi.mocked(Webhooks).mock.results[0]?.value;
      expect(mockHandler).toHaveBeenCalledWith(req);
    });
  });

  describe("subscription.created event", () => {
    it("updates user with subscription data using ObjectId when userId is a valid ObjectId", async () => {
      const req = makeNextRequest();
      await POST(req);

      expect(capturedOnPayload).not.toBeNull();
      await capturedOnPayload!({
        type: "subscription.created",
        data: {
          id: "sub_001",
          productId: "prod_pro",
          customerId: "cus_polar_001",
          status: "active",
          currentPeriodStart: "2025-01-01T00:00:00Z",
          currentPeriodEnd: "2025-02-01T00:00:00Z",
          startedAt: "2025-01-01T00:00:00Z",
          metadata: { userId: VALID_USER_ID },
          customFieldData: {},
        },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const [filter, update] = collectionMock.updateOne.mock.calls[0];
      expect(filter._id).toBeInstanceOf(ObjectId);
      expect(filter._id.toString()).toBe(VALID_USER_ID);
      expect(update.$set).toMatchObject({
        polarCustomerId: "cus_polar_001",
        subscriptionId: "sub_001",
        subscriptionStatus: "active",
        subscriptionPlan: "pro",
      });
    });

    it("sets subscriptionCurrentPeriodStart and End as ISO strings", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.created",
        data: {
          id: "sub_001",
          productId: "prod_pro",
          customerId: "cus_polar_001",
          status: "active",
          currentPeriodStart: "2025-01-01T00:00:00Z",
          currentPeriodEnd: "2025-02-01T00:00:00Z",
          startedAt: "2025-01-01T00:00:00Z",
          metadata: { userId: VALID_USER_ID },
          customFieldData: {},
        },
      });

      const update = collectionMock.updateOne.mock.calls[0][1];
      expect(update.$set.subscriptionCurrentPeriodStart).toBe(
        new Date("2025-01-01T00:00:00Z").toISOString()
      );
      expect(update.$set.subscriptionCurrentPeriodEnd).toBe(
        new Date("2025-02-01T00:00:00Z").toISOString()
      );
      expect(update.$set.subscriptionStartedAt).toBe(
        new Date("2025-01-01T00:00:00Z").toISOString()
      );
    });

    it("falls back to customFieldData.userId when metadata.userId is absent", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.created",
        data: {
          id: "sub_002",
          productId: "prod_starter",
          customerId: "cus_polar_002",
          status: "active",
          currentPeriodStart: null,
          currentPeriodEnd: null,
          startedAt: null,
          metadata: {},
          customFieldData: { userId: VALID_USER_ID },
        },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
    });

    it("does NOT update user when userId is not a valid ObjectId", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.created",
        data: {
          id: "sub_003",
          productId: "prod_pro",
          customerId: "cus_polar_003",
          status: "active",
          currentPeriodStart: null,
          currentPeriodEnd: null,
          startedAt: null,
          metadata: { userId: "not-an-objectid" },
          customFieldData: {},
        },
      });

      expect(collectionMock.updateOne).not.toHaveBeenCalled();
    });

    it("sets period dates to undefined when null in subscription data", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.created",
        data: {
          id: "sub_004",
          productId: "prod_pro",
          customerId: "cus_polar_004",
          status: "active",
          currentPeriodStart: null,
          currentPeriodEnd: null,
          startedAt: null,
          metadata: { userId: VALID_USER_ID },
          customFieldData: {},
        },
      });

      const update = collectionMock.updateOne.mock.calls[0][1];
      expect(update.$set.subscriptionCurrentPeriodStart).toBeUndefined();
      expect(update.$set.subscriptionCurrentPeriodEnd).toBeUndefined();
      expect(update.$set.subscriptionStartedAt).toBeUndefined();
    });
  });

  describe("order.created and order.updated events", () => {
    it("updates polarCustomerId for order.created event", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "order.created",
        data: {
          customerId: "cus_polar_order_001",
          metadata: { userId: VALID_USER_ID },
          customFieldData: {},
        },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const [filter, update] = collectionMock.updateOne.mock.calls[0];
      expect(filter._id).toBeInstanceOf(ObjectId);
      expect(update.$set).toEqual({ polarCustomerId: "cus_polar_order_001" });
    });

    it("updates polarCustomerId for order.updated event", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "order.updated",
        data: {
          customerId: "cus_polar_order_002",
          metadata: { userId: VALID_USER_ID },
          customFieldData: {},
        },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const update = collectionMock.updateOne.mock.calls[0][1];
      expect(update.$set).toEqual({ polarCustomerId: "cus_polar_order_002" });
    });

    it("does NOT update user for order event when userId is invalid ObjectId", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "order.created",
        data: {
          customerId: "cus_polar_order_003",
          metadata: { userId: "invalid-id" },
          customFieldData: {},
        },
      });

      expect(collectionMock.updateOne).not.toHaveBeenCalled();
    });
  });

  describe("subscription.updated event", () => {
    it("updates subscription status and plan by subscriptionId", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.updated",
        data: {
          id: "sub_005",
          productId: "prod_pro",
          status: "active",
          currentPeriodStart: "2025-03-01T00:00:00Z",
          currentPeriodEnd: "2025-04-01T00:00:00Z",
        },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const [filter, update] = collectionMock.updateOne.mock.calls[0];
      expect(filter).toEqual({ subscriptionId: "sub_005" });
      expect(update.$set).toMatchObject({
        subscriptionStatus: "active",
        subscriptionPlan: "pro",
      });
    });

    it("sets period dates from subscription.updated data", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.updated",
        data: {
          id: "sub_005",
          productId: "prod_pro",
          status: "active",
          currentPeriodStart: "2025-03-01T00:00:00Z",
          currentPeriodEnd: "2025-04-01T00:00:00Z",
        },
      });

      const update = collectionMock.updateOne.mock.calls[0][1];
      expect(update.$set.subscriptionCurrentPeriodStart).toBe(
        new Date("2025-03-01T00:00:00Z").toISOString()
      );
      expect(update.$set.subscriptionCurrentPeriodEnd).toBe(
        new Date("2025-04-01T00:00:00Z").toISOString()
      );
    });
  });

  describe("subscription.revoked and subscription.canceled events", () => {
    it("sets subscriptionStatus to 'canceled' on subscription.revoked", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.revoked",
        data: { id: "sub_006" },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const [filter, update] = collectionMock.updateOne.mock.calls[0];
      expect(filter).toEqual({ subscriptionId: "sub_006" });
      expect(update.$set).toEqual({ subscriptionStatus: "canceled" });
    });

    it("sets subscriptionStatus to 'canceled' on subscription.canceled", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "subscription.canceled",
        data: { id: "sub_007" },
      });

      expect(collectionMock.updateOne).toHaveBeenCalledOnce();
      const [filter, update] = collectionMock.updateOne.mock.calls[0];
      expect(filter).toEqual({ subscriptionId: "sub_007" });
      expect(update.$set).toEqual({ subscriptionStatus: "canceled" });
    });
  });

  describe("unknown event types", () => {
    it("does nothing for unknown event types", async () => {
      const req = makeNextRequest();
      await POST(req);

      await capturedOnPayload!({
        type: "unknown.event",
        data: {},
      });

      expect(collectionMock.updateOne).not.toHaveBeenCalled();
      expect(collectionMock.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("calls handleApiError when Webhooks throws", async () => {
      vi.mocked(Webhooks).mockImplementation(() => {
        throw new Error("Webhook initialization error");
      });

      const req = makeNextRequest();
      await POST(req);
      expect(handleApiError).toHaveBeenCalled();
    });
  });
});