"use client";
export default function EmptyState({ title = "NOTHING HERE", subtitle, action, onAction }) {
  return (
    <div style={{ border:"3px dashed #333", padding:"48px 24px", textAlign:"center" }}>
      <p style={{ fontFamily:"Archivo Black, sans-serif", fontSize:16, color:"#555", marginBottom:8 }}>{title}</p>
      {subtitle && <p style={{ fontSize:13, color:"#444", marginBottom:16 }}>{subtitle}</p>}
      {action && onAction && (
        <button onClick={onAction} style={{ border:"3px solid #f5f0e8", background:"transparent", color:"#f5f0e8", padding:"8px 20px", fontFamily:"Archivo Black, sans-serif", fontSize:12, cursor:"pointer" }}>
          {action}
        </button>
      )}
    </div>
  );
}
