"use client";
import { useState, useEffect, useCallback } from "react";

export function useMiniPaySession() {
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [ready, setReady] = useState(false);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) return null;
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const chain = await window.ethereum.request({ method: "eth_chainId" });
      setAddress(accounts[0] || null);
      setChainId(parseInt(chain, 16));
      setReady(true);
      return accounts[0];
    } catch { return null; }
  }, []);

  useEffect(() => {
    if (!window?.ethereum) return;
    // Auto-connect if already authorized
    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts?.length) {
        setAddress(accounts[0]);
        window.ethereum.request({ method: "eth_chainId" }).then(c => setChainId(parseInt(c, 16)));
        setReady(true);
      }
    }).catch(() => {});

    window.ethereum.on?.("accountsChanged", accs => setAddress(accs[0] || null));
    window.ethereum.on?.("chainChanged", c => setChainId(parseInt(c, 16)));
  }, []);

  const isCelo = chainId === 42220;
  const isMiniPay = typeof window !== "undefined" && !!window?.ethereum?.isMiniPay;

  return { address, chainId, isCelo, isMiniPay, ready, connect };
}