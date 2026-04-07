"use client";
import { useState, useEffect } from "react";
export default function Toast({ message, type = "success", onDismiss }) {
  const colors = { success: "#00ff88", error: "#ff3333", info: "#f5f0e8" };
  const color = colors[type] || colors.info;
  useEffect(() => { const t = setTimeout(onDismiss, 3000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div style={{ position:"fixed", bottom:24, right:24, border:`3px solid ${color}`, background:"#0a0a0a", color, padding:"12px 20px", fontFamily:"Space Mono, monospace", fontSize:13, boxShadow:`4px 4px 0px ${color}`, zIndex:9999, maxWidth:360 }}>
      {message}
    </div>
  );
}
