"use client";
import { useState, useEffect, useCallback } from "react";
import { buildProfile } from "@/lib/profile-builder";

export function useProfile(address) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch_ = useCallback(async () => {
    if (!address) return;
    setLoading(true); setError(null);
    try {
      const data = await buildProfile(address);
      setProfile(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [address]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { profile, loading, error, refetch: fetch_ };
}