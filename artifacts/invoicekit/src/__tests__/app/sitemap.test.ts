import { describe, it, expect, vi } from "vitest";

// Mock TEMPLATES_SEO before importing sitemap
vi.mock("@/lib/templates-seo", () => ({
  TEMPLATES_SEO: [
    { slug: "clean", name: "Clean Template", title: "Clean", description: "", features: [], keywords: [] },
    { slug: "modern", name: "Modern Template", title: "Modern", description: "", features: [], keywords: [] },
    { slug: "contractor", name: "Contractor Template", title: "Contractor", description: "", features: [], keywords: [] },
  ],
}));

const sitemapModule = await import("@/app/sitemap");
const sitemap = sitemapModule.default;

describe("sitemap", () => {
  it("returns an array of sitemap entries", () => {
    const entries = sitemap();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it("includes the homepage with highest priority", () => {
    const entries = sitemap();
    const home = entries.find((e) => e.url === "https://invoicekit.app");
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1.0);
  });

  it("includes the /templates route", () => {
    const entries = sitemap();
    const templatesPage = entries.find((e) => e.url === "https://invoicekit.app/templates");
    expect(templatesPage).toBeDefined();
    expect(templatesPage?.priority).toBe(0.9);
  });

  it("includes the /about route", () => {
    const entries = sitemap();
    const about = entries.find((e) => e.url === "https://invoicekit.app/about");
    expect(about).toBeDefined();
    expect(about?.priority).toBe(0.7);
  });

  it("includes the /contact route", () => {
    const entries = sitemap();
    const contact = entries.find((e) => e.url === "https://invoicekit.app/contact");
    expect(contact).toBeDefined();
    expect(contact?.priority).toBe(0.7);
  });

  it("includes the /editor route", () => {
    const entries = sitemap();
    const editor = entries.find((e) => e.url === "https://invoicekit.app/editor");
    expect(editor).toBeDefined();
  });

  it("includes /privacy and /terms with low priority", () => {
    const entries = sitemap();
    const privacy = entries.find((e) => e.url === "https://invoicekit.app/privacy");
    const terms = entries.find((e) => e.url === "https://invoicekit.app/terms");
    expect(privacy).toBeDefined();
    expect(terms).toBeDefined();
    expect(privacy?.priority).toBe(0.3);
    expect(terms?.priority).toBe(0.3);
  });

  it("generates dynamic /templates/[slug] routes for all mocked templates", () => {
    const entries = sitemap();
    expect(entries.find((e) => e.url === "https://invoicekit.app/templates/clean")).toBeDefined();
    expect(entries.find((e) => e.url === "https://invoicekit.app/templates/modern")).toBeDefined();
    expect(entries.find((e) => e.url === "https://invoicekit.app/templates/contractor")).toBeDefined();
  });

  it("sets dynamic template routes with priority 0.8", () => {
    const entries = sitemap();
    const templateEntry = entries.find((e) => e.url === "https://invoicekit.app/templates/clean");
    expect(templateEntry?.priority).toBe(0.8);
  });

  it("sets dynamic template routes with monthly changeFrequency", () => {
    const entries = sitemap();
    const templateEntry = entries.find((e) => e.url === "https://invoicekit.app/templates/clean");
    expect(templateEntry?.changeFrequency).toBe("monthly");
  });

  it("all entries have a lastModified date", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("all entries have the baseUrl prefix", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/invoicekit\.app/);
    }
  });

  it("total count matches static routes + template routes", () => {
    const entries = sitemap();
    // 9 static routes + 3 mock templates = 12
    expect(entries.length).toBe(12);
  });

  it("homepage has weekly changeFrequency (high-traffic page)", () => {
    const entries = sitemap();
    const home = entries.find((e) => e.url === "https://invoicekit.app");
    expect(home?.changeFrequency).toBe("weekly");
  });
});