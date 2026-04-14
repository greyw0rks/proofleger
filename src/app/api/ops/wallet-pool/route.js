import { NextResponse } from "next/server";

const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "dashgrey";

export async function GET(request) {
  const auth = request.headers.get("x-ops-key");
  if (auth !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In production reads from wallets.json on the server
  return NextResponse.json({
    active: 45,
    depleted: 115,
    first100Active: 45,
    last60Active: 0,
    agentBalance: 11.92,
    totalWallets: 160,
    lastChecked: new Date().toISOString(),
  });
}