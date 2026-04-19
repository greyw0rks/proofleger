export function isCeloAddress(addr) {
  return typeof addr === "string" && /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export function celoExplorerTx(txHash) {
  return `https://celoscan.io/tx/${txHash}`;
}

export function celoExplorerAddress(addr) {
  return `https://celoscan.io/address/${addr}`;
}

export function celoExplorerBlock(blockNum) {
  return `https://celoscan.io/block/${blockNum}`;
}

export function shortenCeloTx(hash, chars = 8) {
  if (!hash) return "";
  return `${hash.slice(0, chars)}...${hash.slice(-6)}`;
}

export function formatCeloAmount(wei) {
  // wei is BigInt from viem
  const n = typeof wei === "bigint" ? Number(wei) : Number(wei);
  return (n / 1e18).toFixed(6) + " CELO";
}

export function celoBlockToDate(blockNum, currentBlock, currentDate = new Date()) {
  // Celo ~5s per block
  const diffBlocks = Number(blockNum) - currentBlock;
  const diffMs = diffBlocks * 5000;
  return new Date(currentDate.getTime() + diffMs);
}