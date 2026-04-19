"use client";
import { useState, useEffect } from "react";
import { createPublicClient, http, parseAbi } from "viem";

const CELO_CHAIN = { id: 42220, name: "Celo",
  nativeCurrency: { name:"CELO", symbol:"CELO", decimals:18 },
  rpcUrls: { default: { http: ["https://feth.celo.org"] } } };

const CONTRACT = "0x251B3302c0CcB1cFBeb0cda3dE06C2D312a41735";
const ABI = parseAbi(["function totalDocuments() external view returns (uint256)"]);

export function useCeloDocCount() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createPublicClient({ chain: CELO_CHAIN, transport: http() });
    client.readContract({ address: CONTRACT, abi: ABI, functionName: "totalDocuments" })
      .then(n => setCount(Number(n)))
      .catch(() => setCount(null))
      .finally(() => setLoading(false));
  }, []);

  return { count, loading };
}