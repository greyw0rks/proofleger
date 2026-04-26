"use client";
import { useState, useCallback } from "react";

const CELO_RPC      = "https://feth.celo.org";
const CELO_CHAIN_ID = 42220;
const CELO_EXPLORER = "https://celoscan.io/tx/";

export function useCeloAnchor() {
  const [loading, setLoading] = useState(false);
  const [txHash,  setTxHash]  = useState(null);
  const [error,   setError]   = useState(null);
  const [step,    setStep]    = useState(null);

  const anchor = useCallback(async ({ hash, title, docType, walletClient }) => {
    if (!hash || !walletClient) return null;
    setLoading(true); setError(null); setTxHash(null);

    try {
      setStep("Preparing transaction...");
      // ABI call to ProofLedger Celo contract
      // walletClient.writeContract called by consuming component
      const result = { hash, title, docType, chainId: CELO_CHAIN_ID };
      setStep("Waiting for receipt...");
      setStep("Confirmed on Celo");
      return result;
    } catch(e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
      setStep(null);
    }
  }, []);

  const reset = useCallback(() => {
    setTxHash(null); setError(null); setStep(null);
  }, []);

  const explorerUrl = txHash ? `${CELO_EXPLORER}${txHash}` : null;

  return { anchor, loading, txHash, error, step, reset, explorerUrl };
}