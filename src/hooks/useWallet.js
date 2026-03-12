"use client";
import { useState, useEffect, useCallback } from "react";
import { connect } from "@stacks/connect";

/**
 * useWallet - React hook for Hiro Wallet connection state
 *
 * Manages wallet address, connection status, and connect/disconnect actions.
 * Persists address in localStorage across page refreshes.
 *
 * @returns {{
 *   address: string|null,
 *   connected: boolean,
 *   connecting: boolean,
 *   connect: function,
 *   disconnect: function
 * }}
 *
 * @example
 * const { address, connected, connect, disconnect } = useWallet();
 */
export function useWallet() {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("stx_address");
    if (stored) {
      setAddress(stored);
      setConnected(true);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      await connect({
        appDetails: { name: "ProofLedger", icon: "/favicon.ico" },
        onFinish: (data) => {
          const addr = data.userSession?.loadUserData()?.profile?.stxAddress?.mainnet;
          if (addr) {
            localStorage.setItem("stx_address", addr);
            setAddress(addr);
            setConnected(true);
          }
        },
        onCancel: () => setConnecting(false),
      });
    } catch (err) {
      console.error("useWallet connect error:", err);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    localStorage.removeItem("stx_address");
    setAddress(null);
    setConnected(false);
  }, []);

  return {
    address,
    connected,
    connecting,
    connect: connectWallet,
    disconnect: disconnectWallet,
  };
}
