import { NextResponse } from "next/server";
import { HealthCheckResponse } from "@workspace/api-zod";
import { logger } from "@/server/logger";

export const runtime = "nodejs";

export async function GET() {
  const data = HealthCheckResponse.parse({ status: "ok" });
  logger.debug({ route: "/api/healthz" }, "Health check called");
  return NextResponse.json(data);
}
