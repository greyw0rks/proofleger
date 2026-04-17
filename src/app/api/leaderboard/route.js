import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const limit = Math.min(parseInt(new URL(request.url).searchParams.get("limit")||"20"), 50);
  try {
    const res = await fetch(`https://api.hiro.so/extended/v1/address/${C}.proofleger3/transactions?limit=200`);
    const data = await res.json();
    const walletMap = {};
    for (const tx of (data.results||[]).filter(t=>t.tx_status==="success")) {
      const addr = tx.sender_address;
      if (!walletMap[addr]) walletMap[addr] = { address:addr, anchors:0, attests:0, mints:0 };
      const fn = tx.contract_call?.function_name||"";
      if (fn.includes("store")||fn.includes("anchor")) walletMap[addr].anchors++;
      if (fn.includes("attest")) walletMap[addr].attests++;
      if (fn.includes("mint")) walletMap[addr].mints++;
    }
    const entries = Object.values(walletMap)
      .map(w=>({...w, score:w.anchors*10+w.attests*5+w.mints*25}))
      .sort((a,b)=>b.score-a.score).slice(0,limit);
    return NextResponse.json({ entries, total:entries.length },
      { headers:{"Cache-Control":"s-maxage=300"} });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}