import { cacheWrap } from "./cache";

const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function callReadOnly(contractName, fnName, args) {
  const res = await fetch(`${API}/v2/contracts/call-read/${CONTRACT}/${contractName}/${fnName}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sender: CONTRACT, arguments: args }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.okay) throw new Error("Contract call failed");
  return data.result;
}

export const ProofLedgerClient = {
  verify: (hash) =>
    cacheWrap(`verify:${hash}`,
      () => callReadOnly("proofleger3", "get-doc", ["0x0200000020" + hash]),
      300_000),

  getProfile: (address) =>
    cacheWrap(`profile:${address}`,
      () => fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
      60_000),

  getTxCount: (address) =>
    fetch(`${API}/extended/v1/address/${address}/transactions?limit=1`)
      .then(r => r.json())
      .then(d => d.total || 0),

  getNetworkInfo: () =>
    cacheWrap("network:info",
      () => fetch(`${API}/v2/info`).then(r => r.json()),
      30_000),
};