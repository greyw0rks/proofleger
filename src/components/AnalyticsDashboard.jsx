"use client";
import { useAnalytics } from "@/hooks/useAnalytics";
import StatCard from "./StatCard";
import Spinner from "./Spinner";

export default function AnalyticsDashboard() {
  const { stats, activeWallets, loading } = useAnalytics();

  if (loading) return <div style={{ padding:20 }}><Spinner /></div>;

  const totalTxs = stats ? Object.values(stats).reduce((s, c) => s + (c.total || 0), 0) : 0;
  const totalRecent = stats ? Object.values(stats).reduce((s, c) => s + (c.recent || 0), 0) : 0;

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 }}>
      <StatCard label="TOTAL TRANSACTIONS" value={totalTxs.toLocaleString()} color="#F7931A" sub="all time" />
      <StatCard label="RECENT TXS" value={totalRecent} color="#00ff88" sub="last 50 per contract" />
      <StatCard label="ACTIVE WALLETS" value={activeWallets?.count || 0} color="#38bdf8" sub="last 7 days" />
      <StatCard label="CONTRACTS" value={stats ? Object.keys(stats).length : 0} color="#a78bfa" sub="on mainnet" />
    </div>
  );
}