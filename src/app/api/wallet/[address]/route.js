import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request, { params }) {
  const { address } = params;
  if (!address?.startsWith("SP") && !address?.startsWith("ST")) {
    return NextResponse.json({ error:"Invalid Stacks address" },{ status:400 });
  }
  try {
    const [acct, txs, nfts] = await Promise.allSettled([
      fetch(`${API}/v2/accounts/${address}?proof=0`).then(r=>r.json()),
      fetch(`${API}/extended/v1/address/${address}/transactions?limit=50`).then(r=>r.json()),
      fetch(`${API}/extended/v1/tokens/nft/holdings?principal=${address}&asset_identifiers=${C}.achievements::achievement`).then(r=>r.json()),
    ]);
    const balance = acct.status==="fulfilled" ? Number(acct.value.balance||0)/1e6 : 0;
    const allTxs = txs.status==="fulfilled" ? txs.value.results||[] : [];
    const nftList = nfts.status==="fulfilled" ? nfts.value.results||[] : [];
    const anchors = allTxs.filter(t=>t.tx_status==="success"&&(t.contract_call?.function_name||"").includes("store")).length;
    const attests = allTxs.filter(t=>t.tx_status==="success"&&(t.contract_call?.function_name||"").includes("attest")).length;
    return NextResponse.json({ address, balance, anchors, attests, nfts:nftList.length, totalTxs:txs.status==="fulfilled"?txs.value.total||0:0 });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}