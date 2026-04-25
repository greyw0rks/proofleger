"use client";
import { useEffect, useRef } from "react";
import { useKeyPress } from "@/hooks/useKeyPress";

export default function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  const overlayRef = useRef(null);
  useKeyPress("Escape", { onPress: open ? onClose : undefined });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else      document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, padding: 24 }}>
      <div style={{ background: "#0a0a0a", border: "3px solid #222",
        width: "100%", maxWidth, maxHeight: "90vh", overflowY: "auto",
        position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "18px 20px",
          borderBottom: "2px solid #111" }}>
          {title && (
            <span style={{ fontFamily: "Archivo Black, sans-serif",
              fontSize: 13, color: "#f5f0e8", letterSpacing: 1 }}>
              {title}
            </span>
          )}
          <button onClick={onClose}
            style={{ border: "none", background: "transparent",
              color: "#555", fontSize: 20, cursor: "pointer",
              lineHeight: 1, marginLeft: "auto" }}>×</button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}