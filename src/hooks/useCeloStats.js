"use client";
import { useState, useEffect } from "react";
import { getCeloContractStats, getCeloLatestBlock } from "@/lib/celo-stats";

export function useCeloStats() {
  const [stats, setStats] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, b] = await Promise.all([
        getCeloContractStats(),
        getCeloLatestBlock(),
      ]);
      setStats(s);
      setBlockHeight(b);
      setLoading(false);
    }
    load();
  }, []);

  return { stats, blockHeight, loading };
}