"use client";
import ProtocolStats  from "@/components/ProtocolStats";
import TimelineChart  from "@/components/TimelineChart";
import ActivityFeed   from "@/components/ActivityFeed";
import LeaderboardTable from "@/components/LeaderboardTable";
import StatsStrip     from "@/components/StatsStrip";

export default function StatsPage() {
  return (
    <div style={{ fontFamily: "Space Grotesk, sans-serif",
      color: "#f5f0e8", minHeight: "100vh", background: "#0a0a0a" }}>
      <StatsStrip />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Archivo Black, sans-serif",
            fontSize: 26, marginBottom: 4 }}>STATS</h1>
          <p style={{ color: "#888", fontSize: 13 }}>
            Protocol analytics across Stacks and Celo
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <ProtocolStats />
          <TimelineChart days={30} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "Archivo Black, sans-serif",
                fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 12 }}>
                TOP WALLETS
              </div>
              <LeaderboardTable limit={5} />
            </div>
            <div>
              <ActivityFeed limit={8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}