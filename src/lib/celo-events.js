import { CELO_PROOF_LEDGER_ADDRESS, CELO_RPC } from "./celo-contracts";

export async function getRecentCeloAnchors(fromBlock = "latest", limit = 20) {
  try {
    const res = await fetch(`https://api.celoscan.io/api?module=logs&action=getLogs&address=${CELO_PROOF_LEDGER_ADDRESS}&topic0=0x&page=1&offset=${limit}&apikey=YourApiKey`);
    const data = await res.json();
    return data.result || [];
  } catch { return []; }
}

export async function getCeloDocumentCount(address) {
  const body = {
    jsonrpc: "2.0", method: "eth_call", id: 1,
    params: [{
      to: CELO_PROOF_LEDGER_ADDRESS,
      data: "0x2e68d66c000000000000000000000000" + address.slice(2).padStart(64, "0"),
    }, "latest"],
  };
  const res = await fetch(CELO_RPC, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
  const data = await res.json();
  return data.result ? parseInt(data.result, 16) : 0;
}