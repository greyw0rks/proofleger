export function isStacksAddress(addr) {
  return typeof addr === "string" &&
    (addr.startsWith("SP") || addr.startsWith("ST")) &&
    addr.length >= 30 && addr.length <= 52;
}

export function isCeloAddress(addr) {
  return typeof addr === "string" && /^0x[0-9a-fA-F]{40}$/.test(addr);
}

export function shortenStacksAddress(addr, chars = 6) {
  if (!isStacksAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function shortenCeloAddress(addr, chars = 6) {
  if (!isCeloAddress(addr)) return addr || "";
  return `${addr.slice(0, chars)}...${addr.slice(-4)}`;
}

export function shortenAddress(addr, chars = 6) {
  if (isStacksAddress(addr)) return shortenStacksAddress(addr, chars);
  if (isCeloAddress(addr)) return shortenCeloAddress(addr, chars);
  return addr?.slice(0, chars) + "..." || "";
}

export function getAddressType(addr) {
  if (isStacksAddress(addr)) return "stacks";
  if (isCeloAddress(addr)) return "celo";
  return "unknown";
}