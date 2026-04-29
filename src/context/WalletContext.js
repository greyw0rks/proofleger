"use client";
import { createContext, useContext, useState, useCallback } from "react";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address,     setAddress]     = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    // Placeholder — real impl calls Leather/Xverse via @stacks/connect
    // or wagmi for EVM wallets
    try {
      if (typeof window?.StacksProvider !== "undefined") {
        // Stacks wallet connect
        setAddress("SP1PLACEHOLDER000000000000000000");
        setIsConnected(true);
      }
    } catch(e) { console.error("Wallet connect failed:", e); }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
  }, []);

  return (
    <WalletContext.Provider value={{ address, isConnected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used inside WalletProvider");
  return ctx;
}