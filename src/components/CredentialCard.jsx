const TIER = { gold:"#FCFF52", silver:"#aaa", platinum:"#a78bfa", bronze:"#cd7f32", standard:"#F7931A" };
export default function CredentialCard({ credential, onClick }) {
  if (!credential) return null;
  const { credential_hash, schema, issuer, holder, issued_block, revoked } = credential;
  const valid = !revoked;
  const color = TIER[credential?.level] ?? TIER.standard;
  return (
    <div onClick={onClick} style={{ background:"#111", border:"1px solid #1a1a1a", borderRadius:10, padding:16, cursor:onClick?"pointer":"default" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ fontFamily:"Archivo Black,sans-serif", fontSize:13, color, letterSpacing:1 }}>{schema ?? "Credential"}</div>
        <span style={{ padding:"3px 8px", borderRadius:4, fontSize:10, fontFamily:"Space Mono,monospace", background:valid?"rgba(0,255,136,0.1)":"rgba(255,51,51,0.1)", color:valid?"#00ff88":"#ff3333", border:`1px solid ${valid?"#00ff88":"#ff3333"}` }}>{valid?"VALID":"REVOKED"}</span>
      </div>
      {[["Hash", credential_hash?.slice(0,16)+"…"], ["Issuer", issuer?.slice(0,10)+"…"+issuer?.slice(-4)], ["Block", issued_block]].map(([l,v]) => (
        <div key={l} style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#555" }}>{l}</span>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:10, color:"#888" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}