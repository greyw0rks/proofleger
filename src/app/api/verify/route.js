import { NextResponse } from "next/server";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function POST(request) {
  try {
    const { hashes } = await request.json();
    if (!Array.isArray(hashes) || hashes.length === 0) return NextResponse.json({ error:"hashes array required" }, { status:400 });
    if (hashes.length > 20) return NextResponse.json({ error:"max 20 hashes per request" }, { status:400 });
    const results = await Promise.allSettled(hashes.map(async hash => {
      const res = await fetch(`https://api.hiro.so/v2/contracts/call-read/${C}/proofleger3/get-doc`, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ sender:C, arguments:["0x0200000020"+hash] }),
      });
      const data = await res.json();
      return { hash, found: data.okay && data.result !== "0x09" };
    }));
    const response = results.map((r,i) => r.status === "fulfilled" ? r.value : { hash: hashes[i], found: false, error: r.reason?.message });
    return NextResponse.json({ results: response });
  } catch(e) { return NextResponse.json({ error: e.message }, { status:500 }); }
}