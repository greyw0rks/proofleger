"use client";
import { useState, useCallback } from "react";
import { anchorDocument } from "@/lib/wallet";
export function useAnchor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txId, setTxId] = useState(null);
  const anchor = useCallback(async (hash, title, docType) => {
    setLoading(true); setError(null);
    try { const r = await anchorDocument(hash, title, docType); setTxId(r); return r; }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  return { anchor, loading, error, txId };
}
