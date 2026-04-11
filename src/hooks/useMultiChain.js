"use client";
import { useState, useCallback } from "react";
import { getActiveWallet } from "@/lib/wallet-adapter";

export function useMultiChain(network = "stacks") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txId, setTxId] = useState(null);
  const wallet = getActiveWallet(network);

  const anchor = useCallback(async (hash, title, docType) => {
    setLoading(true); setError(null); setTxId(null);
    try {
      const tx = await wallet.anchor(hash, title, docType);
      setTxId(tx); return tx;
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  }, [network]);

  const verify = useCallback(async (hash) => {
    setLoading(true); setError(null);
    try { return await wallet.verify(hash); }
    catch(e) { setError(e.message); return null; }
    finally { setLoading(false); }
  }, [network]);

  return { anchor, verify, loading, error, txId, explorer: wallet.explorer };
}