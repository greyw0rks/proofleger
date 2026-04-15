export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function unslugify(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function truncate(text, max = 50) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}