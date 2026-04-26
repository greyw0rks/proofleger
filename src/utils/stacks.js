/**
 * ProofLedger Stacks chain utilities
 */

const API = "https://api.hiro.so";

export async function fetchNonce(address) {
  const res = await fetch(
    `${API}/v2/accounts/${address}?unanchored=true`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`Nonce fetch failed: ${res.status}`);
  const data = await res.json();
  return data.nonce ?? 0;
}

export async function broadcastTx(serializedTx) {
  const res = await fetch(`${API}/v2/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: serializedTx,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Broadcast failed (${res.status}): ${text}`);
  let parsed;
  try { parsed = JSON.parse(text); } catch { parsed = { txid: text.trim() }; }
  return parsed;
}

export async function readOnlyCall(contract, fn, args, sender) {
  const [addr, name] = contract.split(".");
  const res = await fetch(
    `${API}/v2/contracts/call-read/${addr}/${name}/${fn}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender, arguments: args }),
    }
  );
  if (!res.ok) throw new Error(`Read-only call failed: ${res.status}`);
  return res.json();
}

export function txExplorerUrl(txId) {
  return `https://explorer.hiro.so/txid/${txId}?chain=mainnet`;
}

export function blockExplorerUrl(blockHeight) {
  return `https://explorer.hiro.so/block/${blockHeight}?chain=mainnet`;
}