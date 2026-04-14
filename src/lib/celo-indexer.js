const CELOSCAN = "https://api.celoscan.io/api";
const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";

export async function getCeloProofsByWallet(address, page = 1) {
  const url = `${CELOSCAN}?module=account&action=txlist&address=${address}&sort=desc&page=${page}&offset=20`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.status !== "1") return [];
    return (data.result || []).filter(tx =>
      tx.to?.toLowerCase() === CONTRACT.toLowerCase() && tx.isError === "0"
    );
  } catch { return []; }
}

export async function getCeloTotalDocs(address) {
  const txs = await getCeloProofsByWallet(address);
  return txs.filter(tx => tx.input?.startsWith("0x")).length;
}

export async function getLatestCeloBlock() {
  try {
    const res = await fetch(`https://feth.celo.org`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc:"2.0", method:"eth_blockNumber", params:[], id:1 }),
    });
    const data = await res.json();
    return parseInt(data.result, 16);
  } catch { return null; }
}