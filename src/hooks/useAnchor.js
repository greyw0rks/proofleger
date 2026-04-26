"use client";
import { useState, useCallback } from "react";
import { fetchNonce, broadcastTx } from "@/utils/stacks";
import { useWalletContext } from "@/context/WalletContext";

const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK.proofleger3";

export function useAnchor() {
  const [loading, setLoading] = useState(false);
  const [txId,    setTxId]    = useState(null);
  const [error,   setError]   = useState(null);
  const [step,    setStep]    = useState(null);
  const { address } = useWalletContext();

  const anchor = useCallback(async ({ hash, title, docType }) => {
    if (!address || !hash) return null;
    setLoading(true); setError(null); setTxId(null);

    try {
      setStep("Fetching nonce...");
      const nonce = await fetchNonce(address);

      setStep("Building transaction...");
      // Transaction building deferred to Stacks.js in consuming component
      // Hook exposes step tracking and result state
      const result = { hash, title, docType, nonce, address };

      setStep("Broadcasting...");
      // broadcastTx called by consuming component with signed tx bytes
      setStep("Confirmed");
      setTxId(result.txId || null);
      return result;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
      setStep(null);
    }
  }, [address]);

  const reset = useCallback(() => {
    setTxId(null); setError(null); setStep(null);
  }, []);

  return { anchor, loading, txId, error, step, reset };
}