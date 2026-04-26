"use client";
import { useState, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

const memCache = new Map();

export function useVerify() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const verify = useCallback(async (hash) => {
    if (!hash) return;
    setLoading(true); setError(null); setResult(null);

    // Check in-memory cache first
    const cached = memCache.get(hash);
    if (cached && Date.now() < cached.expiresAt) {
      setResult(cached.data);
      setLoading(false);
      return cached.data;
    }

    try {
      const res  = await fetch(`${VERIFIER_API}/v2/verify/${hash}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      memCache.set(hash, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      setResult(data);
      return data;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null); setError(null);
  }, []);

  return { verify, result, loading, error, reset,
    exists: result?.found === true };
}