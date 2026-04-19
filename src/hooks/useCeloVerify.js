"use client";
import { useState, useCallback } from "react";
import { createPublicClient, http, parseAbi } from "viem";

const CELO_CHAIN = { id: 42220, name: "Celo",
  nativeCurrency: { name:"CELO", symbol:"CELO", decimals:18 },
  rpcUrls: { default: { http: ["https://feth.celo.org"] } } };

const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const ABI = parseAbi([
  "function getDocument(bytes32 hash) external view returns (address owner, string title, string docType, uint256 blockNumber, bool exists)",
]);

export function useCeloVerify() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(async (hashHex) => {
    setLoading(true); setError(null); setResult(null);
    try {
      const client = createPublicClient({ chain: CELO_CHAIN, transport: http() });
      const hash32 = hashHex.startsWith("0x") ? hashHex : "0x" + hashHex;
      const [owner, title, docType, blockNumber, exists] = await client.readContract({
        address: CONTRACT, abi: ABI, functionName: "getDocument", args: [hash32],
      });
      const data = { owner, title, docType, blockNumber: Number(blockNumber), exists };
      setResult(data);
      return data;
    } catch(e) { setError(e.message); return null; }
    finally { setLoading(false); }
  }, []);

  return { verify, result, loading, error, isVerified: result?.exists === true };
}