import { NextResponse } from "next/server";
const API = "https://api.hiro.so";
const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get("hash");
  if (!hash || !/^[0-9a-fA-F]{64}$/.test(hash)) {
    return NextResponse.json({ error: "Invalid hash" }, { status: 400 });
  }
  try {
    const res = await fetch(`${API}/v2/contracts/call-read/${CONTRACT}/proofleger3/get-doc`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ sender: CONTRACT, arguments: ["0x0200000020" + hash] }),
    });
    const data = await res.json();
    if (!data.okay || data.result === "0x09") {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({ found: true, result: data.result });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
