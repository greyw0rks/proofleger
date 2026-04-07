export async function sha256File(file) {
  const buf = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("");
}
export async function sha256Text(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,"0")).join("");
}
export function isValidSha256(hash) {
  const clean = hash?.startsWith("0x") ? hash.slice(2) : hash;
  return typeof clean === "string" && /^[0-9a-fA-F]{64}$/.test(clean);
}
