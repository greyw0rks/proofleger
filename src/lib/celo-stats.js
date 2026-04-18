const CELOSCAN = "https://api.celoscan.io/api";
const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const CELO_RPC = "https://feth.celo.org";

export async function getCeloContractStats() {
  try {
    const res = await fetch(`${CELOSCAN}?module=account&action=txlist&address=${CONTRACT}&sort=desc&page=1&offset=50`);
    const data = await res.json();
    const txs = data.result || [];
    const success = txs.filter(t => t.isError === "0");
    return {
      totalTxs: success.length,
      uniqueUsers: new Set(success.map(t => t.from)).size,
      lastActivity: success[0]?.timeStamp ? new Date(parseInt(success[0].timeStamp) * 1000).toISOString() : null,
    };
  } catch { return { totalTxs: 0, uniqueUsers: 0, lastActivity: null }; }
}

export async function getCeloLatestBlock() {
  try {
    const res = await fetch(CELO_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc:"2.0", method:"eth_blockNumber", params:[], id:1 }),
    });
    const data = await res.json();
    return parseInt(data.result, 16);
  } catch { return null; }
}

export async function getCeloGasPrice() {
  try {
    const res = await fetch(CELO_RPC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc:"2.0", method:"eth_gasPrice", params:[], id:1 }),
    });
    const data = await res.json();
    return (parseInt(data.result, 16) / 1e9).toFixed(4) + " Gwei";
  } catch { return null; }
}