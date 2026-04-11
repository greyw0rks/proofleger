import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  const limit = Math.min(parseInt(searchParams.get("limit")||"20"), 50);
  if (!wallet) return NextResponse.json({ error:"wallet param required" }, { status:400 });
  try {
    const res = await fetch(`${API}/extended/v1/address/${wallet}/transactions?limit=${limit}`);
    const data = await res.json();
    const proofs = (data.results||[])
      .filter(t => t.tx_status==="success" && t.contract_call?.function_name?.includes("store"))
      .map(t => ({ txid:t.tx_id, block:t.block_height, fn:t.contract_call?.function_name }));
    return NextResponse.json({ wallet, proofs, total: proofs.length });
  } catch(e) { return NextResponse.json({ error:e.message }, { status:500 }); }
}