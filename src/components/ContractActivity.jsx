"use client";
export default function ContractActivity({ contractName, total = 0, recent = 0, successRate = 0 }) {
  return (
    <div style={{ border:"2px solid #1a1a1a", padding:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        <div style={{ fontFamily:"Space Mono, monospace", fontSize:11, color:"#F7931A" }}>
          {contractName}
        </div>
        <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:12,
          color:successRate>=90?"#00ff88":"#F7931A" }}>
          {successRate}%
        </div>
      </div>
      <div style={{ height:4, background:"#111", marginBottom:10 }}>
        <div style={{ height:"100%", background:"#F7931A", width:`${successRate}%` }} />
      </div>
      <div style={{ display:"flex", gap:16, fontFamily:"Space Mono, monospace", fontSize:9, color:"#555" }}>
        <span>{total.toLocaleString()} total</span>
        <span>{recent} recent</span>
      </div>
    </div>
  );
}