"use client";
import { createContext, useContext, useState, useCallback } from "react";

const NetworkContext = createContext(null);

export const NETWORKS = {
  STACKS: { id: "stacks", label: "Stacks", color: "#F7931A", chain: "mainnet" },
  CELO:   { id: "celo",   label: "Celo",   color: "#35D07F", chain: "celo-mainnet" },
};

export function NetworkProvider({ children }) {
  const [network, setNetwork] = useState(NETWORKS.STACKS);

  const switchNetwork = useCallback((id) => {
    const n = Object.values(NETWORKS).find(n => n.id === id);
    if (n) setNetwork(n);
  }, []);

  return (
    <NetworkContext.Provider value={{ network, switchNetwork, isStacks: network.id === "stacks", isCelo: network.id === "celo" }}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetworkContext = () => useContext(NetworkContext);