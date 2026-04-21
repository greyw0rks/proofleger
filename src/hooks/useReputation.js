"use client";
import { useState, useEffect } from "react";
import { cacheWrap } from "@/lib/cache";
const API = "https://api.hiro.so";
const C   = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

async function fetchWalletStats(address) {
  const res = await fetch(`${API}/extended/v1/address/${address}/transactions?limit=100`);
  const data = await res.json();
  const txs = (data.results || []).filter(t => t.tx_status === "success"
    && (t.contract_call?.contract_id || "").startsWith(C));
  const anchors = txs.filter(t => (t.contract_call?.function_name||"").includes("store")).length;
  const attests = txs.filter(t => (t.contract_call?.function_name||"").includes("attest")).length;
  const mints   = txs.filter(t => (t.contract_call?.function_name||"").includes("mint")).length;
  return { anchors, attests, mints, score: anchors*10 + attests*5 + mints*25 };
}

export function useReputation(address) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    cacheWrap(`reputation:${address}`, () => fetchWalletStats(address), 120_000)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [address]);

  return { stats, loading,
    tier: stats ? getReputationTier(stats.score) : null };
}

export function getReputationTier(score) {
  if (score >= 500) return { label:"PLATINUM", color:"#e5e7eb", min:500 };
  if (score >= 200) return { label:"GOLD",     color:"#F7931A", min:200 };
  if (score >= 75)  return { label:"SILVER",   color:"#9ca3af", min:75  };
  if (score >= 20)  return { label:"BRONZE",   color:"#92400e", min:20  };
  return                    { label:"STARTER", color:"#555",    min:0   };
}