import { getReputation } from "@/utils/reputation";

export async function buildProfile(address) {
  const API = "https://api.hiro.so";
  const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

  const [balRes, txRes, nftRes] = await Promise.allSettled([
    fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
    fetch(`${API}/extended/v1/address/${address}/transactions?limit=50`).then(r => r.json()),
    fetch(`${API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${C}.achievements::achievement`).then(r => r.json()),
  ]);

  const balance = balRes.status === "fulfilled" ? Number(balRes.value?.balance || 0) / 1e6 : 0;
  const txs = txRes.status === "fulfilled" ? txRes.value?.results || [] : [];
  const nfts = nftRes.status === "fulfilled" ? nftRes.value?.results || [] : [];

  const anchors = txs.filter(t => t.tx_status === "success" && t.contract_call?.function_name?.includes("store"));
  const attests = txs.filter(t => t.tx_status === "success" && t.contract_call?.function_name?.includes("attest"));

  const docs = anchors.map(t => ({ docType: "other", attestations: 0, hasNFT: false }));
  const reputation = getReputation(docs);

  return { address, balance, anchors: anchors.length, attests: attests.length, nfts: nfts.length, reputation, totalTxs: txs.length };
}