import { NextResponse } from "next/server";
const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const CELOSCAN = "https://api.celoscan.io/api";
export async function GET() {
  try {
    const res = await fetch(`${CELOSCAN}?module=account&action=txlist&address=${CONTRACT}&sort=desc&page=1&offset=50&apikey=YourApiKeyToken`);
    const data = await res.json();
    const txs = (data.result || []).filter(t => t.isError === "0");
    const uniqueUsers = new Set(txs.map(t => t.from)).size;
    const methods = txs.reduce((acc, t) => {
      const input = t.input || "";
      const method = input.startsWith("0x") ? input.slice(0,10) : "unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});
    return NextResponse.json({
      totalTxs: txs.length,
      uniqueUsers,
      lastActivity: txs[0]?.timeStamp ? new Date(parseInt(txs[0].timeStamp)*1000).toISOString() : null,
      methods,
      contract: CONTRACT,
      network: "Celo Mainnet",
    }, { headers: { "Cache-Control": "s-maxage=120" }});
  } catch(e) { return NextResponse.json({ error: e.message },{ status:500 }); }
}