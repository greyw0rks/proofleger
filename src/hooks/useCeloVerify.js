"use client";
import { useState, useCallback } from "react";

const VERIFIER_API = process.env.NEXT_PUBLIC_VERIFIER_API || "";

export function useCeloVerify() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const verify = useCallback(async (hash) => {
    if (!hash) return;
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`${VERIFIER_API}/v2/verify/${hash}?chain=celo`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
      return data;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verify, result, loading, error,
    exists: result?.found === true && result?.chain === "celo" };
}