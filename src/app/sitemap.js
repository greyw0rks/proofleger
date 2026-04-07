export default function sitemap() {
  return [
    { url: "https://proofleger.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://proofleger.vercel.app/verify", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://proofleger.vercel.app/explore", lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: "https://proofleger.vercel.app/faq", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
