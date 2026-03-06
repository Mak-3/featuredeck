import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://featuredeck.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/auth/", "/confirm-email/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
