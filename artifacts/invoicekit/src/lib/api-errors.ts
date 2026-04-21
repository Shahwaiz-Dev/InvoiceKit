import { NextResponse } from "next/server";
import { isAPIError } from "better-auth/api";

export type AppError = {
  message: string;
  code?: string;
  status: number;
};

/**
 * Standardized API error response handler.
 * Prevents information leakage by hiding stack traces in production.
 */
export function handleApiError(error: unknown) {
  console.error("[API ERROR]", error);

  if (isAPIError(error)) {
    const status = typeof error.status === "number" ? error.status : 400;
    return NextResponse.json(
      { error: error.message || "An authentication error occurred.", code: "AUTH_ERROR" },
      { status }
    );
  }

  if (error instanceof Error) {
    // In development, we might want more detail, but for production, keep it generic
    const isDev = process.env.NODE_ENV === "development";
    return NextResponse.json(
      {
        error: isDev ? error.message : "An internal server error occurred.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "An unexpected error occurred.", code: "UNEXPECTED_ERROR" },
    { status: 500 }
  );
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized access.", code: "UNAUTHORIZED" },
    { status: 401 }
  );
}

export function badRequestResponse(message: string, code = "BAD_REQUEST") {
  return NextResponse.json({ error: message, code }, { status: 400 });
}

export function notFoundResponse(message = "Resource not found.", code = "NOT_FOUND") {
  return NextResponse.json({ error: message, code }, { status: 404 });
}
