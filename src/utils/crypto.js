export async function sha256Hex(buffer) {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2,"0"))
    .join("");
}

export async function sha256File(file) {
  const buffer = await file.arrayBuffer();
  return sha256Hex(buffer);
}

export async function sha256Text(text) {
  const enc = new TextEncoder();
  return sha256Hex(enc.encode(text));
}

export function isValidSha256(hash) {
  const clean = hash?.replace(/^0x/i,"") || "";
  return clean.length === 64 && /^[0-9a-fA-F]+$/.test(clean);
}

export function hashesMatch(a, b) {
  const clean = h => h?.replace(/^0x/i,"").toLowerCase() || "";
  return clean(a) === clean(b);
}