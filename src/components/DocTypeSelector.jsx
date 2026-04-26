"use client";
import { DOC_TYPES } from "@/lib/constants";

export default function DocTypeSelector({ value, onChange }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {DOC_TYPES.map(({ value: v, label, color }) => {
        const active = v === value;
        return (
          <button key={v} onClick={() => onChange(v)}
            style={{
              border: `2px solid ${active ? color : "#222"}`,
              background: active ? `${color}14` : "transparent",
              color: active ? color : "#555",
              padding: "5px 12px",
              fontFamily: "Archivo Black, sans-serif",
              fontSize: 9,
              cursor: "pointer",
              letterSpacing: 1,
              transition: "all 0.1s",
            }}>
            {label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}