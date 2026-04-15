"use client";
import { useState } from "react";

export default function Tooltip({ text, children, position = "top" }) {
  const [visible, setVisible] = useState(false);
  const offset = { top:{ bottom:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" },
    bottom:{ top:"calc(100% + 6px)", left:"50%", transform:"translateX(-50%)" },
    left:{ right:"calc(100% + 6px)", top:"50%", transform:"translateY(-50%)" },
    right:{ left:"calc(100% + 6px)", top:"50%", transform:"translateY(-50%)" } };
  return (
    <span style={{ position:"relative", display:"inline-block" }}
      onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <span style={{ position:"absolute", ...offset[position], background:"#1a1a1a",
          border:"2px solid #333", color:"#f5f0e8", padding:"4px 10px", whiteSpace:"nowrap",
          fontFamily:"Space Grotesk, sans-serif", fontSize:11, pointerEvents:"none", zIndex:50 }}>
          {text}
        </span>
      )}
    </span>
  );
}