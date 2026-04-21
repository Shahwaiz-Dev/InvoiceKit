import { describe, it, expect, vi, beforeEach } from "vitest";
import { isAPIError } from "better-auth/api";
import {
  handleApiError,
  unauthorizedResponse,
  badRequestResponse,
  notFoundResponse,
} from "@/lib/api-errors";

// NextResponse mock is set up globally in setup.ts
// isAPIError mock is set up globally in setup.ts

describe("api-errors", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("unauthorizedResponse", () => {
    it("returns a 401 response with UNAUTHORIZED code", () => {
      const response = unauthorizedResponse();
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: "Unauthorized access.",
        code: "UNAUTHORIZED",
      });
    });
  });

  describe("badRequestResponse", () => {
    it("returns a 400 response with the given message", () => {
      const response = badRequestResponse("Invalid input");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Invalid input",
        code: "BAD_REQUEST",
      });
    });

    it("uses a custom code when provided", () => {
      const response = badRequestResponse("Validation failed", "VALIDATION_ERROR");
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
      });
    });

    it("defaults to BAD_REQUEST code when no code provided", () => {
      const response = badRequestResponse("Something bad");
      expect((response.body as { code: string }).code).toBe("BAD_REQUEST");
    });
  });

  describe("notFoundResponse", () => {
    it("returns a 404 response with default message", () => {
      const response = notFoundResponse();
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Resource not found.",
        code: "NOT_FOUND",
      });
    });

    it("returns a 404 response with a custom message", () => {
      const response = notFoundResponse("Invoice not found");
      expect(response.status).toBe(404);
      expect((response.body as { error: string }).error).toBe("Invoice not found");
    });

    it("uses a custom code when provided", () => {
      const response = notFoundResponse("User not found", "USER_NOT_FOUND");
      expect((response.body as { code: string }).code).toBe("USER_NOT_FOUND");
    });
  });

  describe("handleApiError", () => {
    it("handles a standard Error in development mode", () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as { NODE_ENV: string }).NODE_ENV = "development";

      const error = new Error("Something went wrong");
      const response = handleApiError(error);
      expect(response.status).toBe(500);
      expect((response.body as { error: string }).error).toBe("Something went wrong");
      expect((response.body as { code: string }).code).toBe("INTERNAL_SERVER_ERROR");

      (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
    });

    it("hides error message in production mode", () => {
      const originalEnv = process.env.NODE_ENV;
      (process.env as { NODE_ENV: string }).NODE_ENV = "production";

      const error = new Error("Sensitive DB error with credentials");
      const response = handleApiError(error);
      expect(response.status).toBe(500);
      expect((response.body as { error: string }).error).toBe(
        "An internal server error occurred."
      );
      expect((response.body as { code: string }).code).toBe("INTERNAL_SERVER_ERROR");

      (process.env as { NODE_ENV: string }).NODE_ENV = originalEnv;
    });

    it("handles non-Error unknown values", () => {
      const response = handleApiError("a raw string error");
      expect(response.status).toBe(500);
      expect((response.body as { code: string }).code).toBe("UNEXPECTED_ERROR");
    });

    it("handles null error", () => {
      const response = handleApiError(null);
      expect(response.status).toBe(500);
      expect((response.body as { code: string }).code).toBe("UNEXPECTED_ERROR");
    });

    it("handles undefined error", () => {
      const response = handleApiError(undefined);
      expect(response.status).toBe(500);
      expect((response.body as { code: string }).code).toBe("UNEXPECTED_ERROR");
    });

    it("handles an APIError with numeric status", () => {
      const mockApiError = { __isAPIError: true, message: "Not allowed", status: 403 };
      vi.mocked(isAPIError).mockReturnValue(true);
      const response = handleApiError(mockApiError);
      expect(response.status).toBe(403);
      expect((response.body as { error: string }).error).toBe("Not allowed");
      expect((response.body as { code: string }).code).toBe("AUTH_ERROR");
    });

    it("handles an APIError with non-numeric status, defaulting to 400", () => {
      const mockApiError = { __isAPIError: true, message: "Auth error", status: "bad" };
      vi.mocked(isAPIError).mockReturnValue(true);
      const response = handleApiError(mockApiError);
      expect(response.status).toBe(400);
    });

    it("handles an APIError with empty message, using fallback", () => {
      const mockApiError = { __isAPIError: true, message: "", status: 401 };
      vi.mocked(isAPIError).mockReturnValue(true);
      const response = handleApiError(mockApiError);
      expect((response.body as { error: string }).error).toBe(
        "An authentication error occurred."
      );
    });
  });
});