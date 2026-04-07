"use client";
import { useState, useCallback } from "react";
import { verifyDocument } from "@/lib/wallet";
export function useVerify() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const verify = useCallback(async (hash) => {
    setLoading(true); setResult(null); setNotFound(false);
    try {
      const r = await verifyDocument(hash);
      if (r) setResult(r); else setNotFound(true);
    } catch(e) { setNotFound(true); }
    finally { setLoading(false); }
  }, []);
  return { verify, loading, result, notFound };
}
