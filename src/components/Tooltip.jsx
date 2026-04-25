"use client";
import { useState, useRef } from "react";

export default function Tooltip({ children, content, placement = "top" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  const placements = {
    top:    { bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 6px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <span ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && content && (
        <span style={{
          position: "absolute",
          ...placements[placement],
          background: "#1a1a1a",
          border: "1px solid #333",
          color: "#f5f0e8",
          fontFamily: "Space Mono, monospace",
          fontSize: 9,
          padding: "4px 8px",
          whiteSpace: "nowrap",
          zIndex: 100,
          pointerEvents: "none",
        }}>
          {content}
        </span>
      )}
    </span>
  );
}