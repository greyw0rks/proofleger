const STACKS_BLOCK_TIME_S = 600; // ~10 minutes

export function blocksToSeconds(blocks) {
  return blocks * STACKS_BLOCK_TIME_S;
}

export function blocksToMinutes(blocks) {
  return Math.round(blocksToSeconds(blocks) / 60);
}

export function blocksToHours(blocks) {
  return (blocksToSeconds(blocks) / 3600).toFixed(1);
}

export function blocksToDays(blocks) {
  return (blocksToSeconds(blocks) / 86400).toFixed(1);
}

export function estimateBlockDate(targetBlock, currentBlock, currentDate = new Date()) {
  const diffBlocks = targetBlock - currentBlock;
  const diffMs = diffBlocks * STACKS_BLOCK_TIME_S * 1000;
  return new Date(currentDate.getTime() + diffMs);
}

export function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s/60)}m`;
  if (s < 86400) return `${Math.floor(s/3600)}h`;
  return `${Math.floor(s/86400)}d`;
}