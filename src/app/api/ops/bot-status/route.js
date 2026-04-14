import { NextResponse } from "next/server";

const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "dashgrey";

export async function GET(request) {
  const auth = request.headers.get("x-ops-key");
  if (auth !== PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // In production this would read from the bot log file or database
  // For now return mock structure
  return NextResponse.json({
    schedulerRunning: true,
    lastRun: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    nextRun: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    activeWallets: 45,
    txsToday: 150,
    runsCompleted: 12,
    uptime: "99.2%",
  });
}