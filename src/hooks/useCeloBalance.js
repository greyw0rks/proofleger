"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, formatEther } from "viem";

const CELO_CHAIN = { id: 42220, name: "Celo",
  nativeCurrency: { name:"CELO", symbol:"CELO", decimals:18 },
  rpcUrls: { default: { http: ["https://feth.celo.org"] } } };

export function useCeloBalance() {
  const { address } = useAccount();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) { setBalance(null); return; }
    setLoading(true);
    const client = createPublicClient({ chain: CELO_CHAIN, transport: http() });
    client.getBalance({ address })
      .then(b => setBalance(parseFloat(formatEther(b)).toFixed(4)))
      .catch(() => setBalance(null))
      .finally(() => setLoading(false));
  }, [address]);

  return { balance, loading };
}