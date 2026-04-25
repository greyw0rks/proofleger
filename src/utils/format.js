/**
 * ProofLedger formatting utilities
 */

export function shortAddress(address, head = 6, tail = 4) {
  if (!address || address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}

export function shortHash(hash, head = 10, tail = 6) {
  if (!hash || hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}...${hash.slice(-tail)}`;
}

export function formatBlockHeight(height) {
  if (!height) return "—";
  return `#${Number(height).toLocaleString()}`;
}

export function formatTimestamp(ts) {
  if (!ts) return "—";
  const d = new Date(typeof ts === "number" ? ts * 1000 : ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(ts) {
  if (!ts) return "—";
  const ms   = Date.now() - new Date(typeof ts === "number" ? ts * 1000 : ts).getTime();
  const secs = Math.floor(ms / 1000);
  if (secs < 60)   return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

export function formatDocType(type) {
  if (!type) return "Other";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}