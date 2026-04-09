"use client";
import { useState, useCallback } from "react";
import { anchorDocumentCelo } from "@/lib/wallet-celo";
export function useCeloAnchor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const anchor = useCallback(async (hash, title, docType) => {
    setLoading(true); setError(null); setTxHash(null);
    try {
      const tx = await anchorDocumentCelo(hash, title, docType);
      setTxHash(tx); return tx;
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  return { anchor, loading, error, txHash };
}