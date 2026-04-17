import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACTS = ["proofleger3","credentials","achievements"];
export async function GET() {
  try {
    const results = await Promise.allSettled(
      CONTRACTS.map(n => fetch(`https://api.hiro.so/extended/v1/address/${C}.${n}/transactions?limit=50`).then(r=>r.json()))
    );
    const analytics = {};
    results.forEach((r,i) => {
      const name = CONTRACTS[i];
      if (r.status==="fulfilled") {
        const txs = r.value.results||[];
        const ok = txs.filter(t=>t.tx_status==="success");
        analytics[name] = { total:r.value.total||0, recent:txs.length, successRate: txs.length>0?Math.round(ok.length/txs.length*100):0 };
      }
    });
    const totalTxs = Object.values(analytics).reduce((s,c)=>s+(c.total||0),0);
    return NextResponse.json({ contracts:analytics, totalTransactions:totalTxs, lastUpdated:new Date().toISOString() },
      { headers:{"Cache-Control":"s-maxage=120"} });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}