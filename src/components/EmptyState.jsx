"use client";
export default function EmptyState({ title, subtitle, action, onAction }) {
  return (
    <div style={{ textAlign:"center", padding:"40px 24px",
      border:"3px dashed #1a1a1a" }}>
      <div style={{ fontFamily:"Archivo Black, sans-serif",
        fontSize:14, color:"#444", marginBottom:8 }}>{title}</div>
      {subtitle && (
        <div style={{ fontFamily:"Space Grotesk, sans-serif",
          fontSize:12, color:"#555", marginBottom:16 }}>{subtitle}</div>
      )}
      {action && onAction && (
        <button onClick={onAction}
          style={{ border:"3px solid #F7931A", background:"transparent",
            color:"#F7931A", padding:"10px 20px", fontFamily:"Archivo Black, sans-serif",
            fontSize:11, cursor:"pointer", letterSpacing:1 }}>
          {action}
        </button>
      )}
    </div>
  );
}