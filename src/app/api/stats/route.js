import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET() {
  try {
    const [stacksInfo, txs] = await Promise.all([
      fetch(`${API}/v2/info`).then(r=>r.json()),
      fetch(`${API}/extended/v1/address/${C}.proofleger3/transactions?limit=1`).then(r=>r.json()),
    ]);
    return NextResponse.json({
      stacks: {
        blockHeight: stacksInfo.stacks_tip_height,
        burnBlockHeight: stacksInfo.burn_block_height,
        totalTxs: txs.total || 0,
        network: "mainnet",
      },
      celo: { contract:"0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735", network:"mainnet" },
      updatedAt: new Date().toISOString(),
    }, { headers:{"Cache-Control":"s-maxage=60"} });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}