"use client";
import { useState, useCallback } from "react";
import { openContractCall } from "@stacks/connect";
import { bufferCVFromString } from "@stacks/transactions";
import { useWalletContext } from "@/context/WalletContext";
import { toast } from "@/lib/notification-queue";

const CONTRACT = "SP1SY1E599GN04XRD2DQBKV7E62HYBJR2CT9S5QKK";

export function useMintNFT() {
  const [loading, setLoading] = useState(false);
  const [txId, setTxId]       = useState(null);
  const [error, setError]     = useState(null);
  const { address }           = useWalletContext();

  const mint = useCallback(async (hashHex) => {
    if (!address) { toast.error("Connect your wallet first"); return; }
    setLoading(true); setError(null); setTxId(null);
    const clean = hashHex.replace(/^0x/i, "");
    try {
      await new Promise((resolve, reject) => {
        openContractCall({
          contractAddress: CONTRACT,
          contractName:    "achievements",
          functionName:    "mint",
          functionArgs: [
            bufferCVFromString(Buffer.from(clean, "hex").toString("binary")),
          ],
          onFinish: (d) => {
            setTxId(d.txId);
            toast.success("Achievement NFT minted!");
            resolve(d.txId);
          },
          onCancel: () => reject(new Error("Cancelled")),
        });
      });
    } catch(e) {
      setError(e.message);
      if (!e.message.includes("Cancel")) toast.error("Mint failed");
    } finally { setLoading(false); }
  }, [address]);

  return { mint, loading, txId, error };
}