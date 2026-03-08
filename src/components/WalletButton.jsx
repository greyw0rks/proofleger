"use client";

import { useState, useEffect } from "react";
import { connectWallet, disconnectWallet, isWalletConnected, getAddress } from "@/lib/wallet";

export default function WalletButton({ onConnect, onDisconnect }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
  try {
    if (isWalletConnected()) {
      const addr = getAddress();
      setAddress(addr);
      if (onConnect) onConnect(addr);
    }
  } catch (e) {
    console.log("Wallet check failed:", e);
  }
}, []); 
 const handleConnect = () => {
    setLoading(true);
    try {
      connectWallet({
       onSuccess: (data) => {
  const addr = data.address;
  setAddress(addr);
  setLoading(false);
  if (onConnect) onConnect(addr);
},
        
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (e) {
      console.error("Connect error:", e);
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
    } catch (e) {
      console.log("Disconnect error:", e);
    }
    setAddress(null);
    if (onDisconnect) onDisconnect();
  };

  if (!mounted) return (
    <button className="wallet-btn" disabled>
      Connect Hiro Wallet
    </button>
  );

  if (!address) return (
    <button className="wallet-btn" onClick={handleConnect} disabled={loading}>
      {loading ? "Connecting..." : "Connect Hiro Wallet"}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button className="wallet-btn connected">
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
      <button className="wallet-btn" onClick={handleDisconnect}>
        Disconnect
      </button>
    </div>
  );
}
