"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { CACHE_KEYS } from "@/lib/constants";

const NETWORKS = [
  { id: "stacks", label: "Stacks", chainId: null },
  { id: "celo",   label: "Celo",   chainId: 42220 },
];

const NetworkContext = createContext(null);

export function NetworkProvider({ children }) {
  const [network, setNetworkState] = useState(NETWORKS[0]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEYS.networkPref);
      if (saved) {
        const found = NETWORKS.find(n => n.id === saved);
        if (found) setNetworkState(found);
      }
    } catch {}
  }, []);

  function setNetwork(n) {
    setNetworkState(n);
    try { localStorage.setItem(CACHE_KEYS.networkPref, n.id); } catch {}
  }

  return (
    <NetworkContext.Provider value={{ network, setNetwork, networks: NETWORKS }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetworkContext() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetworkContext must be used inside NetworkProvider");
  return ctx;
}