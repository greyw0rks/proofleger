import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const SCORES = { diploma:50, research:40, certificate:30, art:20, contribution:20, award:10, other:10 };
const TIERS = [{min:1000,label:"Legend"},{min:500,label:"Authority"},{min:250,label:"Expert"},{min:100,label:"Contributor"},{min:0,label:"Builder"}];
export async function GET(request) {
  const address = new URL(request.url).searchParams.get("address");
  if (!address?.startsWith("SP")) return NextResponse.json({ error:"Invalid address" }, { status:400 });
  try {
    const res = await fetch(`https://api.hiro.so/extended/v1/address/${address}/transactions?limit=50`);
    const data = await res.json();
    const txs = (data.results||[]).filter(t => t.tx_status==="success" && t.tx_type==="contract_call");
    let score = 0;
    for (const tx of txs) {
      const fn = tx.contract_call?.function_name || "";
      if (fn.includes("store")) score += 10;
      if (fn.includes("attest")) score += 5;
      if (fn.includes("mint")) score += 25;
    }
    const tier = TIERS.find(t => score >= t.min) || TIERS[TIERS.length-1];
    return NextResponse.json({ address, score, tier: tier.label, transactions: txs.length });
  } catch(e) { return NextResponse.json({ error:e.message }, { status:500 }); }
}