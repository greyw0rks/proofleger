"use client";
export default function Spinner({ size = 20, color = "#F7931A" }) {
  return (
    <span style={{ display:"inline-block", width:size, height:size,
      border:`2px solid transparent`, borderTop:`2px solid ${color}`,
      borderRadius:"50%", animation:"spin 0.7s linear infinite",
      flexShrink:0 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}