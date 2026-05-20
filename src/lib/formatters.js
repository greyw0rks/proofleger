export const truncHash = (h, head = 8, tail = 6) => h ? `${h.slice(0, head)}…${h.slice(-tail)}` : "";
export const truncAddr = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "";
export const microToStx = (micro) => micro != null ? (micro / 1_000_000).toFixed(4) : "0";
export const stxToMicro = (stx) => Math.round(Number(stx) * 1_000_000);
export const formatBlock = (b) => b != null ? `#${Number(b).toLocaleString()}` : "—";
export const formatAgo = (blockHeight, currentBlock, blockTime = 600) => {
  if (!blockHeight || !currentBlock) return "—";
  const secs = (currentBlock - blockHeight) * blockTime;
  if (secs < 60) return `${secs}s ago`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
};
export const chainLabel = (chain) => chain === "celo" ? "Celo" : "Stacks";
export const chainColor = (chain) => chain === "celo" ? "#FCFF52" : "#F7931A";