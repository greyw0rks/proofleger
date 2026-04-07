export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/ops/"] },
    sitemap: "https://proofleger.vercel.app/sitemap.xml",
  };
}
