"use client";
import { useState, useCallback } from "react";
import { openContractCall } from "@stacks/connect";
import { bufferCVFromString } from "@stacks/transactions";
import { useWalletContext } from "@/context/WalletContext";
import { toast } from "@/lib/notification-queue";

const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useAttest() {
  const [loading, setLoading] = useState(false);
  const [txId, setTxId]       = useState(null);
  const [error, setError]     = useState(null);
  const { address }           = useWalletContext();

  const attest = useCallback(async (hashHex) => {
    if (!address) { toast.error("Connect your wallet first"); return; }
    setLoading(true); setError(null); setTxId(null);
    const cleanHash = hashHex.replace(/^0x/i, "");
    try {
      await new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT,
          contractName:    "proofleger3",
          functionName:    "attest-document",
          functionArgs:    [bufferCVFromString(Buffer.from(cleanHash, "hex").toString("binary"))],
          onFinish: (data) => { setTxId(data.txId); toast.success("Attestation submitted!"); resolve(data.txId); },
          onCancel: () => reject(new Error("User cancelled")),
        });
      });
    } catch(e) { setError(e.message); toast.error("Attestation failed"); }
    finally { setLoading(false); }
  }, [address]);

  return { attest, loading, txId, error };
}