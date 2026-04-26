"use client";
import { useWalletStats } from "@/hooks/useWalletStats";
import StatCard from "./StatCard";
import Spinner  from "./Spinner";

export default function WalletStats({ address }) {
  const { stats, loading, error, stacksCount, celoCount, total } = useWalletStats(address);

  if (loading) return (
    <div style={{ padding: 24, textAlign: "center" }}><Spinner size={20} /></div>
  );
  if (error || !stats) return null;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      <StatCard label="TOTAL PROOFS"  value={total}       color="#F7931A" />
      <StatCard label="STACKS"        value={stacksCount} color="#F7931A" />
      <StatCard label="CELO"          value={celoCount}   color="#FCFF52" />
    </div>
  );
}