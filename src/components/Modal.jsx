"use client";
import { useEffect } from "react";
import { useKeyboard } from "@/hooks/useKeyboard";

export default function Modal({ open, onClose, title, children, maxWidth = 560 }) {
  useKeyboard({ "escape": onClose });
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.8)",
        display:"flex", alignItems:"center", justifyContent:"center",
        zIndex:1000, padding:24 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:"#0a0a0a", border:"3px solid #f5f0e8",
          boxShadow:"8px 8px 0 #f5f0e8", width:"100%", maxWidth,
          padding:28, position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:20 }}>
          {title && <div style={{ fontFamily:"Archivo Black, sans-serif",
            fontSize:18, color:"#f5f0e8" }}>{title}</div>}
          <button onClick={onClose}
            style={{ background:"none", border:"none", color:"#666",
              cursor:"pointer", fontSize:20, lineHeight:1, marginLeft:"auto" }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}