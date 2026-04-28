"use client";
import { useState, useEffect, useCallback } from "react";
import { useWalletContext } from "@/context/WalletContext";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useAchievements(address_) {
  const { address: ctxAddr } = useWalletContext();
  const address = address_ || ctxAddr;

  const [achievements, setAchievements] = useState([]);
  const [loading,      setLoading]      = useState(false);

  const fetch_ = useCallback(async () => {
    if (!address || !VERIFIER_API) return;
    setLoading(true);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/achievements/${address}`);
      if (!res.ok) return;
      const data = await res.json();
      setAchievements(data.achievements || []);
    } catch {}
    setLoading(false);
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return {
    achievements, loading, refresh: fetch_,
    count: achievements.length,
    latest: achievements[0] ?? null,
  };
}