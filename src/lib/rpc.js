const API = "https://api.hiro.so";
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
export async function getAccountInfo(address) {
  const res = await fetchWithRetry(`${API}/v2/accounts/${address}?proof=0`);
  return res.json();
}
export async function getContractTxs(contractId, limit = 50, offset = 0) {
  const res = await fetchWithRetry(`${API}/extended/v1/address/${contractId}/transactions?limit=${limit}&offset=${offset}`);
  return res.json();
}
export async function getNetworkInfo() {
  const res = await fetchWithRetry(`${API}/v2/info`);
  return res.json();
}
