"use client";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const SECTIONS = [
  { key:"network",       label:"Default Network",    opts:["stacks","celo","both"] },
  { key:"docType",       label:"Default Doc Type",   opts:["diploma","certificate","research","other"] },
  { key:"theme",         label:"Accent Color",       opts:["bitcoin","celo","purple","blue"] },
];

export default function SettingsPage() {
  const [prefs, setPrefs] = useLocalStorage("pl_prefs", {
    network:"stacks", docType:"diploma", theme:"bitcoin"
  });
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth:560, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28, marginBottom:32 }}>SETTINGS</h1>
      {SECTIONS.map(s => (
        <div key={s.key} style={{ marginBottom:24 }}>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
            color:"#555", marginBottom:10, letterSpacing:2 }}>
            {s.label.toUpperCase()}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {s.opts.map(opt => {
              const active = prefs[s.key] === opt;
              return (
                <button key={opt}
                  onClick={() => setPrefs(p => ({...p, [s.key]: opt}))}
                  style={{ border:`2px solid ${active?"#F7931A":"#333"}`,
                    background: active ? "rgba(247,147,26,0.1)" : "transparent",
                    color: active ? "#F7931A" : "#666",
                    padding:"8px 16px", fontFamily:"Archivo Black, sans-serif",
                    fontSize:10, cursor:"pointer", letterSpacing:1 }}>
                  {opt.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <button onClick={save}
        style={{ background:"#F7931A", border:"3px solid #F7931A", color:"#000",
          padding:"12px 24px", fontFamily:"Archivo Black, sans-serif",
          fontSize:13, cursor:"pointer", marginTop:8 }}>
        {saved ? "SAVED ✓" : "SAVE SETTINGS"}
      </button>
    </div>
  );
}