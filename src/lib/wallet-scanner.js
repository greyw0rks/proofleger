const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export async function scanWallet(address, limit = 50) {
  const res = await fetch(`${API}/extended/v1/address/${address}/transactions?limit=${limit}`);
  const data = await res.json();
  const txs = (data.results || []).filter(t => t.tx_status === "success");

  const proofTxs = txs.filter(t => {
    const ca = t.contract_call?.contract_id || "";
    return ca.startsWith(C);
  });

  return {
    address,
    total: data.total || 0,
    proofTransactions: proofTxs.length,
    breakdown: {
      anchors: proofTxs.filter(t => (t.contract_call?.function_name||"").includes("store")).length,
      attests: proofTxs.filter(t => (t.contract_call?.function_name||"").includes("attest")).length,
      mints:   proofTxs.filter(t => (t.contract_call?.function_name||"").includes("mint")).length,
    },
    recent: proofTxs.slice(0, 10),
  };
}

export async function getWalletNFTs(address) {
  const res = await fetch(`${API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${C}.achievements::achievement`);
  const data = await res.json();
  return data.results || [];
}