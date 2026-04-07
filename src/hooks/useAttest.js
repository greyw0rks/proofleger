"use client";
import { useState, useCallback } from "react";
import { attestDocument } from "@/lib/wallet";
export function useAttest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const attest = useCallback(async (hash) => {
    setLoading(true); setError(null); setSuccess(false);
    try { await attestDocument(hash); setSuccess(true); }
    catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  return { attest, loading, error, success };
}
