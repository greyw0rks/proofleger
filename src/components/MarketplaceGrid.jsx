import { useState } from "react";
import { useMarketplace } from "@/hooks/useMarketplace";
export default function MarketplaceGrid() {
  const [schema, setSchema] = useState("");
  const { listings, loading } = useMarketplace({ schema: schema || undefined });
  const schemas = [...new Set(listings.map(l => l.schema))];
  return (
    <div>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
        {["All", ...schemas].map(s => (
          <button key={s} onClick={() => setSchema(s === "All" ? "" : s)} style={{ padding:"5px 12px", background:schema === (s==="All"?"":s)?"#F7931A":"#1a1a1a", border:"none", borderRadius:5, color:schema === (s==="All"?"":s)?"#0a0a0a":"#888", cursor:"pointer", fontFamily:"Space Mono,monospace", fontSize:10, textTransform:"uppercase" }}>{s}</button>
        ))}
      </div>
      {loading ? <div style={{ color:"#555", textAlign:"center", padding:24, fontFamily:"Space Mono,monospace" }}>Loading…</div> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {listings.map((l, i) => (
            <div key={l.listing_id ?? i} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:10, padding:16 }}>
              <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:13, color:"#F7931A", marginBottom:8 }}>{l.schema}</div>
              <div style={{ fontFamily:"Space Mono,monospace", fontSize:12, color:"#f5f0e8" }}>{(l.price / 1e6).toFixed(2)} STX</div>
              <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555", marginTop:4 }}>{l.seller?.slice(0,14)}…</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}