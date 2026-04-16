const BASE = "https://api.hiro.so";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${path}`);
  return res.json();
}

export const StacksAPI = {
  getAccountInfo: (addr) => get(`/v2/accounts/${addr}?proof=0&unanchored=true`),
  getAccountTransactions: (addr, limit=20, offset=0) =>
    get(`/extended/v1/address/${addr}/transactions?limit=${limit}&offset=${offset}`),
  getTransaction: (txid) => get(`/extended/v1/tx/${txid}`),
  getContractInfo: (addr, name) => get(`/v2/contracts/interface/${addr}/${name}`),
  getContractTransactions: (addr, name, limit=50) =>
    get(`/extended/v1/address/${addr}.${name}/transactions?limit=${limit}`),
  getNFTHoldings: (addr, assetId) =>
    get(`/extended/v1/tokens/nft/holdings?principal=${addr}&asset_identifiers=${assetId}`),
  getNetworkInfo: () => get(`/v2/info`),
  getFeeEstimate: () => get(`/v2/fees/transfer`),
};