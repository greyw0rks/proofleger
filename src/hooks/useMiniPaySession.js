"use client";
import { useEffect } from "react";
import { useMiniPay } from "./useMiniPay";

export function useMiniPaySession(onConnect) {
  const { isMiniPay, connect, address } = useMiniPay();

  useEffect(() => {
    if (isMiniPay && !address) {
      connect().then(addr => { if (addr && onConnect) onConnect(addr); });
    }
  }, [isMiniPay]);

  return { isMiniPay, address };
}