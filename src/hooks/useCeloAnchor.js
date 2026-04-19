"use client";
import { useState, useCallback } from "react";
import { useWalletClient, usePublicClient } from "wagmi";
import { parseAbi, keccak256, toHex } from "viem";

const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const ABI = parseAbi([
  "function anchorDocument(bytes32 hash, string title, string docType) external",
  "function getDocument(bytes32 hash) external view returns (address owner, string title, string docType, uint256 blockNumber, bool exists)",
]);

export function useCeloAnchor() {
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const anchor = useCallback(async (hashHex, title, docType = "diploma") => {
    if (!walletClient) throw new Error("Connect Celo wallet first");
    setLoading(true); setError(null); setTxHash(null);
    try {
      const hash32 = hashHex.startsWith("0x") ? hashHex : "0x" + hashHex;
      const tx = await walletClient.writeContract({
        address: CONTRACT, abi: ABI,
        functionName: "anchorDocument",
        args: [hash32, title, docType],
      });
      await publicClient.waitForTransactionReceipt({ hash: tx });
      setTxHash(tx);
      return tx;
    } catch(e) { setError(e.message); throw e; }
    finally { setLoading(false); }
  }, [walletClient, publicClient]);

  return { anchor, loading, txHash, error };
}