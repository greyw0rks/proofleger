"use client";
import { useState, useEffect, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useTalentScore(address) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);

  const fetch_ = useCallback(async () => {
    if (!address || !VERIFIER_API) return;
    setLoading(true);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/talent/${address}`);
      if (res.ok) setData(await res.json());
    } catch {}
    setLoading(false);
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return {
    data, loading, refresh: fetch_,
    score:      data?.builder_score ?? 0,
    isVerified: data?.score_valid   === 1,
    passportId: data?.passport_id   ?? null,
  };
}