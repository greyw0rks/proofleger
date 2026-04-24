"use client";
import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import ActivityFeed from "@/components/ActivityFeed";
import CeloStats from "@/components/CeloStats";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import LazySection from "@/components/LazySection";

export default function StatsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:28, marginBottom:8 }}>STATS</h1>
      <p style={{ color:"#888", fontSize:13, marginBottom:32 }}>
        Live ProofLedger protocol metrics
      </p>

      <section style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:16, letterSpacing:2 }}>STACKS</div>
        {stats?.stacks && (
          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
            <StatCard label="BLOCK HEIGHT"
              value={stats.stacks.blockHeight?.toLocaleString()} color="#F7931A" />
            <StatCard label="BITCOIN BLOCK"
              value={stats.stacks.burnBlockHeight?.toLocaleString()} color="#F7931A"
              sub="anchored to" />
            <StatCard label="TOTAL TXS"
              value={stats.stacks.totalTxs?.toLocaleString()} color="#f5f0e8" />
          </div>
        )}
      </section>

      <section style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:16, letterSpacing:2 }}>CELO</div>
        <CeloStats />
      </section>

      <section style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:16, letterSpacing:2 }}>PROTOCOL ACTIVITY</div>
        <LazySection>
          <AnalyticsDashboard />
        </LazySection>
      </section>

      <section>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
          color:"#555", marginBottom:16, letterSpacing:2 }}>RECENT ON-CHAIN</div>
        <LazySection>
          <ActivityFeed limit={20} />
        </LazySection>
      </section>
    </div>
  );
}