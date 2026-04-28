/**
 * ProofLedger Celo chain utilities
 */

export const CELO_CHAIN_ID = 42220;
export const CELO_RPC      = "https://feth.celo.org";
export const CELO_EXPLORER = "https://celoscan.io";

export const celoChain = {
  id:   CELO_CHAIN_ID,
  name: "Celo",
  network: "celo",
  nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
  rpcUrls: { default: { http: [CELO_RPC] } },
  blockExplorers: { default: { name: "CeloScan", url: CELO_EXPLORER } },
};

export function celoTxUrl(txHash) {
  return `${CELO_EXPLORER}/tx/${txHash}`;
}

export function celoAddressUrl(address) {
  return `${CELO_EXPLORER}/address/${address}`;
}

export function celoBlockUrl(blockNumber) {
  return `${CELO_EXPLORER}/block/${blockNumber}`;
}

export function isValidCeloAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export function shortCeloAddress(address, head = 6, tail = 4) {
  if (!address || address.length <= head + tail + 3) return address;
  return `${address.slice(0, head)}...${address.slice(-tail)}`;
}