"use client";
import { useNetwork } from "@/hooks/useNetwork";

export default function Footer() {
  const { blockHeight } = useNetwork();
  return (
    <footer style={{ borderTop:"3px solid #1a1a1a", padding:"32px 24px",
      fontFamily:"Space Grotesk, sans-serif" }}>
      <div style={{ maxWidth:960, margin:"0 auto",
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:14,
            color:"#F7931A", marginBottom:8 }}>PROOFLEGER</div>
          <div style={{ fontSize:12, color:"#555", maxWidth:260, lineHeight:1.6 }}>
            Anchor documents to Bitcoin permanently. Built on Stacks and Celo.
          </div>
        </div>
        <div style={{ display:"flex", gap:32 }}>
          {[
            { title:"PROTOCOL", links:[["Explore","/explore"],["Stats","/stats"],["FAQ","/faq"]] },
            { title:"DEVELOPERS", links:[["SDK","https://npmjs.com/package/proofleger-sdk"],["Contracts","https://github.com/greyw0rks/proofleger-contracts"],["GitHub","https://github.com/greyw0rks/proofleger"]] },
          ].map((col,i) => (
            <div key={i}>
              <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:10,
                color:"#444", marginBottom:10, letterSpacing:1 }}>{col.title}</div>
              {col.links.map(([label,href]) => (
                <a key={label} href={href} target={href.startsWith("http")?"_blank":"_self"} rel="noreferrer"
                  style={{ display:"block", fontSize:12, color:"#555", textDecoration:"none", marginBottom:6 }}
                  onMouseOver={e => e.target.style.color="#f5f0e8"}
                  onMouseOut={e => e.target.style.color="#555"}>
                  {label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ width:"100%", borderTop:"1px solid #1a1a1a", paddingTop:16,
          display:"flex", justifyContent:"space-between", fontSize:10,
          fontFamily:"Space Mono, monospace", color:"#444" }}>
          <span>© 2026 greyw0rks · MIT License</span>
          {blockHeight && <span>Bitcoin Block #{Number(blockHeight).toLocaleString()}</span>}
        </div>
      </div>
    </footer>
  );
}