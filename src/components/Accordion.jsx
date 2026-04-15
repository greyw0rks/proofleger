"use client";
import { useState } from "react";

export function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom:"2px solid #1a1a1a" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width:"100%", background:"none", border:"none", padding:"16px 0",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          cursor:"pointer", textAlign:"left" }}>
        <span style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
          color:"#f5f0e8" }}>{title}</span>
        <span style={{ color:"#F7931A", fontSize:18, fontFamily:"Space Mono, monospace",
          transition:"transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom:16, fontFamily:"Space Grotesk, sans-serif",
          fontSize:13, color:"#888", lineHeight:1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Accordion({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <AccordionItem key={i} title={item.question}>{item.answer}</AccordionItem>
      ))}
    </div>
  );
}