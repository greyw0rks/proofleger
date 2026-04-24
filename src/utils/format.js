export function fmtStx(microStx) {
  const stx = Number(microStx) / 1_000_000;
  if (stx >= 1000) return `${(stx / 1000).toFixed(2)}K STX`;
  return `${stx.toFixed(4)} STX`;
}

export function fmtBlock(height) {
  if (!height) return "—";
  return `#${Number(height).toLocaleString()}`;
}

export function fmtAddress(addr, chars = 6) {
  if (!addr) return "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function fmtScore(score) {
  if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
  return String(score);
}

export function fmtPercent(n, total) {
  if (!total) return "0%";
  return `${Math.round((n / total) * 100)}%`;
}

export function fmtRelativeTime(isoString) {
  if (!isoString) return "—";
  const diff  = Date.now() - new Date(isoString).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}