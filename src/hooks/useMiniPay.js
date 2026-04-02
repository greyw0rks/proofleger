"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * useMiniPay - Detects MiniPay wallet and auto-connects
 *
 * MiniPay injects window.ethereum with isMiniPay = true.
 * Inside MiniPay the address is available immediately with no user action.
 * Outside MiniPay it falls back to standard window.ethereum.
 *
 * @returns {{ isMiniPay, address, connected, connect, error }}
 */
export function useMiniPay() {
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const detected = window.ethereum?.isMiniPay === true;
    setIsMiniPay(detected);
    if (detected) autoConnect();
  }, []);

  async function autoConnect() {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts[0]) { setAddress(accounts[0]); setConnected(true); }
    } catch (err) { setError(err.message); }
  }

  const connect = useCallback(async () => {
    try {
      setError(null);
      if (!window.ethereum) throw new Error("No wallet found. Install MiniPay or MetaMask.");
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts[0]) { setAddress(accounts[0]); setConnected(true); }
    } catch (err) { setError(err.message); }
  }, []);

  return { isMiniPay, address, connected, connect, error };
}
