export function timeAgo(timestamp) {
  if (!timestamp) return "unknown";
  const diff = Date.now() - new Date(timestamp).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s/86400)}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
export function formatIso(date) {
  return new Date(date).toISOString().slice(0,10);
}
export function estimateBlockTime(blockHeight, currentHeight, currentTime = Date.now()) {
  const BLOCK_TIME_MS = 10 * 60 * 1000;
  const diff = blockHeight - currentHeight;
  return new Date(currentTime + diff * BLOCK_TIME_MS);
}
