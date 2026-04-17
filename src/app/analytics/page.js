"use client";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import LeaderboardTable from "@/components/LeaderboardTable";

export default function AnalyticsPage() {
  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:8 }}>ANALYTICS</h1>
      <p style={{ color:"#888", marginBottom:32, fontSize:13 }}>
        Live ProofLedger protocol statistics from Stacks mainnet
      </p>
      <section style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
          color:"#555", marginBottom:16, letterSpacing:2 }}>PROTOCOL OVERVIEW</div>
        <AnalyticsDashboard />
      </section>
      <section>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13,
          color:"#555", marginBottom:16, letterSpacing:2 }}>TOP CONTRIBUTORS</div>
        <LeaderboardTable limit={20} />
      </section>
    </div>
  );
}