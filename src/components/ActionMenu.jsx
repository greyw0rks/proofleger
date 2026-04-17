"use client";
import { useState, useRef, useEffect } from "react";

export default function ActionMenu({ actions = [] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ border:"2px solid #333", background:"transparent", color:"#888",
          padding:"6px 10px", fontFamily:"Space Mono, monospace", fontSize:12,
          cursor:"pointer", letterSpacing:2 }}>
        •••
      </button>
      {open && (
        <div style={{ position:"absolute", right:0, top:"100%", marginTop:4,
          background:"#0a0a0a", border:"3px solid #f5f0e8",
          boxShadow:"4px 4px 0 #f5f0e8", zIndex:50, minWidth:160 }}>
          {actions.map((action, i) => (
            <button key={i} onClick={() => { action.onClick(); setOpen(false); }}
              style={{ display:"block", width:"100%", background:"none",
                border:"none", borderBottom: i < actions.length-1 ? "1px solid #1a1a1a" : "none",
                color: action.danger ? "#ff3333" : "#f5f0e8",
                padding:"10px 16px", fontFamily:"Space Grotesk, sans-serif",
                fontSize:12, cursor:"pointer", textAlign:"left" }}
              onMouseOver={e => e.currentTarget.style.background="#111"}
              onMouseOut={e => e.currentTarget.style.background="none"}>
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}