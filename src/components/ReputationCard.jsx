"use client";
import { useReputation } from "@/hooks/useReputation";
import StatCard from "./StatCard";
import Spinner  from "./Spinner";

export default function ReputationCard({ address }) {
  const { data, loading, score, anchorCount, attestCount } = useReputation(address);

  if (loading) return <div style={{ padding: 20, textAlign: "center" }}><Spinner size={18} /></div>;
  if (!data)   return null;

  return (
    <div style={{ border: "2px solid #1a1a1a", padding: 20 }}>
      <div style={{ fontFamily: "Archivo Black, sans-serif",
        fontSize: 9, color: "#555", letterSpacing: 2, marginBottom: 14 }}>
        REPUTATION
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <StatCard label="SCORE"   value={score}       color="#F7931A" />
        <StatCard label="ANCHORS" value={anchorCount} color="#888"    />
        <StatCard label="ATTESTS" value={attestCount} color="#888"    />
      </div>
    </div>
  );
}