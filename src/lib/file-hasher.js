import { sha256Hex } from "@/utils/crypto";

export async function hashLargeFile(file, onProgress) {
  const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB chunks
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const chunks = [];
  let processed = 0;

  for (let i = 0; i < totalChunks; i++) {
    const start  = i * CHUNK_SIZE;
    const end    = Math.min(start + CHUNK_SIZE, file.size);
    const chunk  = file.slice(start, end);
    const buffer = await chunk.arrayBuffer();
    chunks.push(new Uint8Array(buffer));
    processed++;
    if (onProgress) onProgress(Math.round((processed / totalChunks) * 100));
    // Yield to browser between chunks
    await new Promise(r => setTimeout(r, 0));
  }

  const combined = new Uint8Array(chunks.reduce((acc, c) => acc + c.length, 0));
  let offset = 0;
  for (const chunk of chunks) { combined.set(chunk, offset); offset += chunk.length; }
  return sha256Hex(combined.buffer);
}

export function getFileSizeMB(file) {
  return (file.size / (1024 * 1024)).toFixed(2);
}

export function isLargeFile(file, thresholdMB = 10) {
  return file.size > thresholdMB * 1024 * 1024;
}