"use client";
import { useCallback } from "react";
import { useNetworkContext } from "@/context/NetworkContext";
import { toast } from "@/lib/notification-queue";

export function useNetworkSwitch() {
  const { network, setNetwork, networks } = useNetworkContext();

  const switchTo = useCallback((networkId) => {
    const target = networks?.find(n => n.id === networkId);
    if (!target) return;
    if (target.id === network?.id) return;
    setNetwork(target);
    toast.info(`Switched to ${target.label}`);
  }, [network, networks, setNetwork]);

  const toggle = useCallback(() => {
    const ids = (networks || []).map(n => n.id);
    const idx = ids.indexOf(network?.id);
    const next = networks[(idx + 1) % ids.length];
    if (next) switchTo(next.id);
  }, [network, networks, switchTo]);

  return { network, switchTo, toggle, networks: networks || [] };
}