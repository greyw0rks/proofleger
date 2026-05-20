export default function ReferralCard({ stats }) {
  if (!stats) return null;
  const { referral_count, referred_by } = stats;
  return (
    <div style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:10, padding:20 }}>
      <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:13, letterSpacing:1, textTransform:"uppercase", color:"#f5f0e8", marginBottom:14 }}>Referrals</div>
      <div style={{ display:"flex", gap:12 }}>
        <div style={{ flex:1, padding:"12px", background:"#0a0a0a", borderRadius:8, textAlign:"center" }}>
          <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:28, color:"#F7931A" }}>{referral_count ?? 0}</div>
          <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555", letterSpacing:1 }}>REFERRED</div>
        </div>
        {referred_by && (
          <div style={{ flex:2, padding:"12px", background:"#0a0a0a", borderRadius:8 }}>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555", letterSpacing:1, marginBottom:4 }}>REFERRED BY</div>
            <div style={{ fontFamily:"Space Mono,monospace", fontSize:11, color:"#888", wordBreak:"break-all" }}>{referred_by}</div>
          </div>
        )}
      </div>
    </div>
  );
}