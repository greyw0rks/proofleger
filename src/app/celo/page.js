"use client";
import { useState } from "react";
import { useHash } from "@/hooks/useHash";
import CeloAnchorPanel from "@/components/CeloAnchorPanel";
import CeloVerifyResult from "@/components/CeloVerifyResult";
import CeloActivityFeed from "@/components/CeloActivityFeed";
import CeloStats from "@/components/CeloStats";
import { useCeloVerify } from "@/hooks/useCeloVerify";

export default function CeloPage() {
  const [tab, setTab] = useState("anchor");
  const [file, setFile] = useState(null);
  const [verifyHash, setVerifyHash] = useState("");
  const { hash, hashing, hashFile } = useHash();
  const { verify, result, loading: verifying } = useCeloVerify();

  const tabStyle = (t) => ({
    padding:"10px 20px", border:"none", background:"transparent",
    color: tab===t ? "#35D07F" : "#555",
    borderBottom: tab===t ? "3px solid #35D07F" : "3px solid transparent",
    fontFamily:"Archivo Black, sans-serif", fontSize:11,
    cursor:"pointer", letterSpacing:1
  });

  return (
    <div style={{ maxWidth:720, margin:"0 auto", padding:"40px 24px",
      fontFamily:"Space Grotesk, sans-serif", color:"#f5f0e8",
      minHeight:"100vh", background:"#0a0a0a" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-start", marginBottom:32 }}>
        <div>
          <h1 style={{ fontFamily:"Archivo Black, sans-serif", fontSize:28,
            marginBottom:4 }}>CELO PROOFS</h1>
          <p style={{ color:"#888", fontSize:13 }}>
            Anchor documents to Celo — sub-cent fees via MiniPay
          </p>
        </div>
        <div style={{ border:"2px solid #35D07F", padding:"4px 12px",
          fontFamily:"Space Mono, monospace", fontSize:9, color:"#35D07F" }}>
          MAINNET
        </div>
      </div>

      <div style={{ marginBottom:24 }}>
        <CeloStats />
      </div>

      <div style={{ display:"flex", borderBottom:"2px solid #1a1a1a", marginBottom:24 }}>
        {["anchor","verify","activity"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === "anchor" && (
        <div>
          <div onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){setFile(f);hashFile(f);}}}
            onClick={() => document.getElementById("celo-file").click()}
            style={{ border:"3px dashed #444", padding:32, textAlign:"center",
              cursor:"pointer", marginBottom:20 }}>
            <input id="celo-file" type="file" style={{display:"none"}}
              onChange={e=>{const f=e.target.files[0];if(f){setFile(f);hashFile(f);}}} />
            <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:13, color:"#555" }}>
              {hashing ? "HASHING..." : file ? file.name : "DROP FILE OR CLICK TO HASH"}
            </div>
            {hash && (
              <div style={{ fontFamily:"Space Mono, monospace", fontSize:10,
                color:"#35D07F", marginTop:8, wordBreak:"break-all" }}>
                {hash}
              </div>
            )}
          </div>
          {hash && <CeloAnchorPanel hash={hash} onSuccess={() => {}} />}
        </div>
      )}

      {tab === "verify" && (
        <div>
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            <input value={verifyHash} onChange={e => setVerifyHash(e.target.value)}
              placeholder="Enter document hash (0x...)"
              style={{ flex:1, background:"transparent", border:"3px solid #333",
                color:"#f5f0e8", padding:"12px 14px", fontFamily:"Space Mono, monospace",
                fontSize:12, outline:"none" }}
              onKeyDown={e => e.key==="Enter" && verify(verifyHash.trim())} />
            <button onClick={() => verify(verifyHash.trim())} disabled={verifying||!verifyHash}
              style={{ background:"#35D07F", border:"3px solid #35D07F", color:"#000",
                padding:"12px 20px", fontFamily:"Archivo Black, sans-serif",
                fontSize:12, cursor:"pointer" }}>
              {verifying ? "..." : "VERIFY"}
            </button>
          </div>
          {result && <CeloVerifyResult result={result} hash={verifyHash} />}
        </div>
      )}

      {tab === "activity" && (
        <div>
          <div style={{ fontFamily:"Archivo Black, sans-serif", fontSize:11,
            color:"#555", marginBottom:16, letterSpacing:2 }}>
            RECENT CELO ANCHORS
          </div>
          <CeloActivityFeed limit={20} />
        </div>
      )}
    </div>
  );
}