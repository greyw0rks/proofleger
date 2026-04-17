export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function titleCase(str) {
  return str?.split(" ").map(capitalize).join(" ") || "";
}

export function ellipsis(str, max = 30) {
  if (!str || str.length <= max) return str || "";
  return str.slice(0, max - 3) + "...";
}

export function hexPreview(hex, chars = 8) {
  const clean = hex?.replace("0x","") || "";
  if (clean.length <= chars * 2) return clean;
  return `${clean.slice(0, chars)}...${clean.slice(-chars)}`;
}

export function countWords(str) {
  return str?.trim().split(/\s+/).filter(Boolean).length || 0;
}

export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || "";
}