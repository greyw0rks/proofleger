import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  if (!address || !address.startsWith("SP")) {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }
  try {
    const [balRes, txRes] = await Promise.all([
      fetch(`${API}/v2/accounts/${address}?proof=0`).then(r => r.json()),
      fetch(`${API}/extended/v1/address/${address}/transactions?limit=20`).then(r => r.json()),
    ]);
    return NextResponse.json({
      address,
      balance: Number(balRes.balance || 0) / 1_000_000,
      transactions: txRes.results || [],
      total: txRes.total || 0,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
