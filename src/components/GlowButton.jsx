"use client";
import { useState } from "react";

export default function GlowButton({ children, onClick, disabled = false,
  color = "#F7931A", size = "md" }) {
  const [hovered, setHovered] = useState(false);
  const pad = size === "lg" ? "14px 32px" : size === "sm" ? "6px 14px" : "10px 24px";
  const fs  = size === "lg" ? 12 : size === "sm" ? 9 : 10;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border:      `2px solid ${disabled ? "#333" : color}`,
        background:  disabled ? "transparent" : hovered ? `${color}20` : "transparent",
        color:       disabled ? "#333" : color,
        padding:     pad,
        fontFamily:  "Archivo Black, sans-serif",
        fontSize:    fs,
        cursor:      disabled ? "default" : "pointer",
        letterSpacing: 1,
        boxShadow:   !disabled && hovered ? `0 0 16px ${color}44` : "none",
        transition:  "all 0.15s",
      }}>
      {children}
    </button>
  );
}