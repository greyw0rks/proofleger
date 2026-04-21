export function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now  = Date.now();
  const diff = now - date.getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400)return `${Math.floor(s/3600)}h ago`;
  if (s < 604800)return `${Math.floor(s/86400)}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", { month:"short", day:"numeric",
    year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US",
    { month:"short", day:"numeric", year:"numeric" });
}

export function isRecent(dateStr, hours = 24) {
  return Date.now() - new Date(dateStr).getTime() < hours * 3600000;
}