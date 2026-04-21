import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock next/server NextResponse globally
vi.mock("next/server", () => {
  const NextResponse = {
    json: vi.fn((body: unknown, init?: ResponseInit) => ({
      body,
      status: init?.status ?? 200,
      headers: init?.headers ?? {},
      json: async () => body,
    })),
  };
  return { NextResponse };
});

// Mock server-only to avoid "server-only" package errors in tests
vi.mock("server-only", () => ({}));

// Mock @workspace/db to avoid MongoDB connection in tests
vi.mock("@workspace/db", async () => {
  const { ObjectId } = await import("mongodb");
  return {
    ObjectId,
    db: {
      collection: vi.fn(),
    },
  };
});

// Mock better-auth/api
vi.mock("better-auth/api", () => ({
  isAPIError: vi.fn((error: unknown) => {
    return (
      error !== null &&
      typeof error === "object" &&
      "__isAPIError" in (error as object)
    );
  }),
}));