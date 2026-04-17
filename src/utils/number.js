export const fmt = {
  compact: (n) => {
    if (n >= 1_000_000) return `${(n/1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n/1_000).toFixed(1)}K`;
    return String(n);
  },
  percent: (n, total) => total > 0 ? `${Math.round((n/total)*100)}%` : "0%",
  pad: (n, digits = 2) => String(n).padStart(digits, "0"),
  range: (n, min, max) => Math.min(Math.max(n, min), max),
};

export function microToStx(micro) {
  return Number(micro) / 1_000_000;
}

export function stxToMicro(stx) {
  return Math.floor(Number(stx) * 1_000_000);
}

export function hexToDecimal(hex) {
  return parseInt(hex.replace("0x", ""), 16);
}