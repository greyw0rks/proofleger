"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { connect, disconnect, getAddress, isWalletConnected } from "@/lib/wallet";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    setConnecting(true);
    try {
      await connect();
      const addr = getAddress();
      setAddress(addr);
      return addr;
    } catch(e) {
      console.error(e);
    } finally { setConnecting(false); }
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setAddress(null);
  }, []);

  return (
    <WalletContext.Provider value={{ address, connecting, connectWallet, disconnectWallet, isConnected: !!address }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWalletContext = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used inside WalletProvider");
  return ctx;
};