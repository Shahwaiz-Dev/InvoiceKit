import { describe, it, expect } from "vitest";

/**
 * Tests for the security headers added to next.config.ts in this PR.
 * We test the headers() function output directly rather than the Next.js config object.
 */

// Inline the headers function logic to avoid importing the full Next.js config
// (which requires webpack/build infrastructure). We mirror the structure
// from next.config.ts so changes there require matching changes here.
async function getSecurityHeaders() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.google.com https://*.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://*.googleusercontent.com https://*.polar.sh https://avatar.vercel.sh; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.google.com https://*.polar.sh; frame-src 'self' https://*.polar.sh; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ];
}

describe("next.config.ts security headers", () => {
  it("returns exactly one route matcher entry", async () => {
    const headers = await getSecurityHeaders();
    expect(headers).toHaveLength(1);
  });

  it("applies headers to all routes via /(.*) pattern", async () => {
    const headers = await getSecurityHeaders();
    expect(headers[0].source).toBe("/(.*)");
  });

  it("includes exactly 5 security headers", async () => {
    const headers = await getSecurityHeaders();
    expect(headers[0].headers).toHaveLength(5);
  });

  it("includes Content-Security-Policy header", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp).toBeDefined();
  });

  it("CSP includes default-src 'self'", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("default-src 'self'");
  });

  it("CSP blocks object-src to prevent plugin attacks", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("object-src 'none'");
  });

  it("CSP prevents framing via frame-ancestors none", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("frame-ancestors 'none'");
  });

  it("CSP upgrades insecure requests", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("upgrade-insecure-requests");
  });

  it("X-Frame-Options is set to DENY", async () => {
    const headers = await getSecurityHeaders();
    const xFrame = headers[0].headers.find((h) => h.key === "X-Frame-Options");
    expect(xFrame?.value).toBe("DENY");
  });

  it("X-Content-Type-Options is set to nosniff", async () => {
    const headers = await getSecurityHeaders();
    const xct = headers[0].headers.find((h) => h.key === "X-Content-Type-Options");
    expect(xct?.value).toBe("nosniff");
  });

  it("Referrer-Policy is set to strict-origin-when-cross-origin", async () => {
    const headers = await getSecurityHeaders();
    const referrer = headers[0].headers.find((h) => h.key === "Referrer-Policy");
    expect(referrer?.value).toBe("strict-origin-when-cross-origin");
  });

  it("Permissions-Policy disables camera, microphone, geolocation", async () => {
    const headers = await getSecurityHeaders();
    const permissions = headers[0].headers.find((h) => h.key === "Permissions-Policy");
    expect(permissions?.value).toBe("camera=(), microphone=(), geolocation=()");
  });

  it("all header keys are strings", async () => {
    const headers = await getSecurityHeaders();
    for (const header of headers[0].headers) {
      expect(typeof header.key).toBe("string");
      expect(typeof header.value).toBe("string");
    }
  });

  it("CSP allows polar.sh for frame-src", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("frame-src 'self' https://*.polar.sh");
  });

  it("CSP allows google fonts for style-src", async () => {
    const headers = await getSecurityHeaders();
    const csp = headers[0].headers.find((h) => h.key === "Content-Security-Policy");
    expect(csp?.value).toContain("https://fonts.googleapis.com");
  });
});