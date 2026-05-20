import { useOraclePrice } from "@/hooks/useOraclePrice";
export default function OraclePriceTicker({ asset = "STX" }) {
  const { formatted, change24h, trend } = useOraclePrice(asset);
  if (!formatted) return null;
  const arrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "→";
  const clr = trend === "up" ? "#00ff88" : trend === "down" ? "#ff3333" : "#888";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px", background:"#111", border:"1px solid #1a1a1a", borderRadius:8 }}>
      <span style={{ fontFamily:"Archivo Black,sans-serif", fontSize:11, color:"#555", letterSpacing:1 }}>{asset}</span>
      <span style={{ fontFamily:"Space Mono,monospace", fontSize:13, color:"#f5f0e8" }}>{formatted}</span>
      <span style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:clr }}>{arrow} {Math.abs(change24h ?? 0).toFixed(2)}%</span>
    </div>
  );
}