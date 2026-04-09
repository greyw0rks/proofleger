"use client";
import { useState, useCallback } from "react";
import { CELO_CONTRACT_ADDRESS, CELO_RPC } from "@/lib/wallet-celo";
export function useCeloProfile(address) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Read profile from Celo profiles contract
      const res = await fetch(`https://celoscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=YourApiKey`);
      const data = await res.json();
      setProfile({ address, txCount: data.result?.length || 0 });
    } catch {}
    finally { setLoading(false); }
  }, [address]);
  return { profile, loading, fetch: fetch_ };
}