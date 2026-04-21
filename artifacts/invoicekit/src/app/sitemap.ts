import type { MetadataRoute } from "next";
import { TEMPLATES_SEO } from "@/lib/templates-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://invoicekit.app";
  const now = new Date();

  // Static routes
  const staticRoutes = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/templates", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/editor", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/login", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/register", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  // Dynamic template routes
  const templateRoutes = TEMPLATES_SEO.map((template) => ({
    url: `/templates/${template.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const allRoutes = [...staticRoutes, ...templateRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
