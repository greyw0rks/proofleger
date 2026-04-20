import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const C = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  if (!hash) return NextResponse.json({ error:"hash required" },{ status:400 });
  const clean = hash.replace("0x","");
  try {
    const res = await fetch(`${API}/v2/contracts/call-read/${C}/proofleger3/get-doc`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ sender:C, arguments:["0x0200000020"+clean] }),
    });
    const data = await res.json();
    const exists = data.okay && data.result && data.result !== "0x09";
    return NextResponse.json({ hash, exists, network:"stacks", verified: exists });
  } catch(e) { return NextResponse.json({ error:e.message },{ status:500 }); }
}