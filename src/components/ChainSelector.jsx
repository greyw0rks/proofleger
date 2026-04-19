"use client";
import { useNetworkContext, NETWORKS } from "@/context/NetworkContext";

const CHAIN_DESC = {
  stacks: "Anchored to Bitcoin via Stacks. Permanent & censorship-resistant.",
  celo:   "Sub-cent fees via Celo. Ideal for high-volume document anchoring.",
};

export default function ChainSelector() {
  const { network, switchNetwork } = useNetworkContext();

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {Object.values(NETWORKS).map(net => {
        const active = network.id === net.id;
        return (
          <div key={net.id} onClick={() => switchNetwork(net.id)}
            style={{ border:`3px solid ${active ? net.color : "#222"}`,
              padding:16, cursor:"pointer",
              boxShadow: active ? `4px 4px 0 ${net.color}` : "none",
              transition:"all 0.15s" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:6 }}>
              <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
                color: active ? net.color : "#888" }}>
                {net.label.toUpperCase()}
              </div>
              <div style={{ width:14, height:14, borderRadius:"50%",
                border:`3px solid ${active ? net.color : "#444"}`,
                background: active ? net.color : "transparent" }} />
            </div>
            <div style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:11,
              color:"#555" }}>
              {CHAIN_DESC[net.id]}
            </div>
          </div>
        );
      })}
    </div>
  );
}