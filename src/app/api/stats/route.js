import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
const CONTRACTS = ["proofleger3","credentials","achievements"];
export async function GET() {
  try {
    const results = await Promise.all(CONTRACTS.map(name =>
      fetch(`${API}/extended/v1/address/${CONTRACT}.${name}/transactions?limit=1`)
        .then(r => r.json()).catch(() => ({ results:[], total:0 }))
    ));
    const stats = {
      contracts: CONTRACTS.length,
      transactions: results.reduce((s,r) => s + (r.total||0), 0),
      lastUpdated: new Date().toISOString(),
    };
    return NextResponse.json(stats, { headers:{ "Cache-Control":"s-maxage=60" } });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
