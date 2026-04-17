import { StacksAPI } from "./stacks-api";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export async function buildLeaderboard(limit = 20) {
  const data = await StacksAPI.getContractTransactions(C, "proofleger3", 200);
  const txs = (data.results || []).filter(t => t.tx_status === "success");

  const walletMap = {};
  for (const tx of txs) {
    const addr = tx.sender_address;
    if (!walletMap[addr]) walletMap[addr] = { address: addr, anchors: 0, attests: 0, mints: 0 };
    const fn = tx.contract_call?.function_name || "";
    if (fn.includes("store") || fn.includes("anchor")) walletMap[addr].anchors++;
    if (fn.includes("attest")) walletMap[addr].attests++;
    if (fn.includes("mint")) walletMap[addr].mints++;
  }

  return Object.values(walletMap)
    .map(w => ({ ...w, score: w.anchors * 10 + w.attests * 5 + w.mints * 25 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getRankLabel(rank) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}