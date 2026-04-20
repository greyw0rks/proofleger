"use client";
import { useState, useEffect, useCallback } from "react";

export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const detected = !!(window.ethereum?.isMiniPay);
    setIsMiniPay(detected);
    if (detected) {
      window.ethereum.request({ method: "eth_accounts" })
        .then(accounts => { if (accounts[0]) setAddress(accounts[0]); })
        .catch(() => {});
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) return null;
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0] || null);
      return accounts[0] || null;
    } catch { return null; }
    finally { setConnecting(false); }
  }, []);

  return { isMiniPay, address, connecting, connect, isConnected: !!address };
}