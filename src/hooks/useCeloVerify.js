"use client";
import { useState, useCallback } from "react";
import { verifyDocumentCelo } from "@/lib/wallet-celo";
export function useCeloVerify() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const verify = useCallback(async (hash) => {
    setLoading(true); setResult(null); setNotFound(false);
    try {
      const r = await verifyDocumentCelo(hash);
      if (r && r.exists) setResult(r); else setNotFound(true);
    } catch { setNotFound(true); }
    finally { setLoading(false); }
  }, []);
  return { verify, loading, result, notFound };
}