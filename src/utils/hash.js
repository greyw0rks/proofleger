/**
 * ProofLedger client-side SHA-256 hashing utilities
 */

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export async function hashFile(file, onProgress) {
  if (!window.crypto?.subtle) throw new Error("SubtleCrypto not available");

  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  const buffers = [];

  for (let i = 0; i < chunks; i++) {
    const start  = i * CHUNK_SIZE;
    const end    = Math.min(start + CHUNK_SIZE, file.size);
    const slice  = file.slice(start, end);
    const buf    = await slice.arrayBuffer();
    buffers.push(buf);
    onProgress?.(Math.round(((i + 1) / chunks) * 100));
  }

  // Concatenate all chunks
  const total  = buffers.reduce((s, b) => s + b.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset   = 0;
  for (const buf of buffers) {
    merged.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }

  const hashBuf = await window.crypto.subtle.digest("SHA-256", merged);
  return bufToHex(hashBuf);
}

export async function hashText(text) {
  if (!window.crypto?.subtle) throw new Error("SubtleCrypto not available");
  const encoded = new TextEncoder().encode(text);
  const hashBuf = await window.crypto.subtle.digest("SHA-256", encoded);
  return bufToHex(hashBuf);
}

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isHexHash(str) {
  return /^[0-9a-f]{64}$/i.test(str?.replace(/^0x/i, ""));
}