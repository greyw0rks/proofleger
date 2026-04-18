"use client";
import { useState, useCallback } from "react";
import { verifyCredentialFull } from "@/lib/credential-verifier";

export function useCredentialVerify() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async (hash) => {
    if (!hash) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const r = await verifyCredentialFull(hash);
      setResult(r);
      return r;
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  return { verify, result, loading, error,
    isVerified: result?.exists && !result?.revoked,
    isRevoked: result?.revoked };
}