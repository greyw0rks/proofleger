"use client";
import { useState, useCallback } from "react";
import { openContractCall } from "@stacks/connect";
import { stringAsciiCV, bufferCVFromString } from "@stacks/transactions";
import { useWalletContext } from "@/context/WalletContext";
import { toast } from "@/lib/notification-queue";
import { addToHistory } from "@/lib/proof-history";
import { withRetry } from "@/lib/retry";

const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useAnchor() {
  const [loading, setLoading]  = useState(false);
  const [txId, setTxId]        = useState(null);
  const [error, setError]      = useState(null);
  const [step, setStep]        = useState(null);
  const { address }            = useWalletContext();

  const anchor = useCallback(async (hashHex, title, docType = "diploma") => {
    if (!address) { toast.error("Connect your wallet first"); return; }
    setLoading(true); setError(null); setTxId(null);

    try {
      setStep("preparing");
      const cleanHash = hashHex.replace(/^0x/i, "");

      setStep("signing");
      await withRetry(() => new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT,
          contractName:    "proofleger3",
          functionName:    "store",
          functionArgs: [
            bufferCVFromString(Buffer.from(cleanHash, "hex").toString("binary")),
            stringAsciiCV(title.slice(0, 100)),
            stringAsciiCV(docType),
          ],
          onFinish: async (data) => {
            setTxId(data.txId);
            setStep("submitted");
            toast.success("Document anchored to Bitcoin!");
            await addToHistory({ hash: cleanHash, title, docType, txId: data.txId });
            resolve(data.txId);
          },
          onCancel: () => reject(new Error("User cancelled")),
        });
      }), { maxAttempts: 1 });
    } catch(e) {
      setError(e.message);
      toast.error(e.message.includes("cancel") ? "Transaction cancelled" : "Anchor failed");
    } finally { setLoading(false); setStep(null); }
  }, [address]);

  return { anchor, loading, txId, error, step };
}