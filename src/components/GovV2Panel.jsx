import { useGovV2 } from "@/hooks/useGovV2";
function QuorumBar({ proposal }) {
  const total = (proposal.for_weight ?? 0) + (proposal.against_weight ?? 0);
  const forPct = total > 0 ? Math.round((proposal.for_weight / total) * 100) : 0;
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"Space Mono,monospace", fontSize:10, color:"#555", marginBottom:4 }}>
        <span style={{ color:"#00ff88" }}>FOR {forPct}%</span>
        <span style={{ color:"#ff3333" }}>AGAINST {100-forPct}%</span>
      </div>
      <div style={{ height:4, background:"#1a1a1a", borderRadius:2, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${forPct}%`, background:"#00ff88", transition:"width 0.3s" }} />
      </div>
    </div>
  );
}
export default function GovV2Panel() {
  const { active, loading } = useGovV2();
  if (loading) return <div style={{ color:"#555", fontFamily:"Space Mono,monospace", fontSize:12, padding:16 }}>Loading…</div>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {active.length === 0 && <div style={{ color:"#555", fontFamily:"Space Grotesk,sans-serif", fontSize:13, padding:16, textAlign:"center" }}>No active proposals</div>}
      {active.map(p => (
        <div key={p.proposal_id} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:10, padding:16 }}>
          <div style={{ fontFamily:"Space Grotesk,sans-serif", fontSize:14, color:"#f5f0e8", marginBottom:4 }}>{p.title}</div>
          <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555" }}>Ends block {p.end_block}</div>
          <QuorumBar proposal={p} />
        </div>
      ))}
    </div>
  );
}