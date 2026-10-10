import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL ?? "https://donut-smp-trade.onrender.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The collector write endpoint must never be indexed or crawled.
        disallow: ["/api/ingest"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}