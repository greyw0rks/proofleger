"use client";
import Modal from "./Modal";

export default function NetworkSwitchModal({ open, onClose, onSwitch, targetNetwork = "celo" }) {
  const config = {
    celo:   { label:"Celo Mainnet", color:"#35D07F", desc:"Switch to Celo for sub-cent transactions via MiniPay" },
    stacks: { label:"Stacks Mainnet", color:"#F7931A", desc:"Switch to Stacks to anchor documents to Bitcoin" },
  };
  const net = config[targetNetwork] || config.stacks;
  return (
    <Modal open={open} onClose={onClose} title="SWITCH NETWORK">
      <p style={{ fontFamily:"Space Grotesk, sans-serif", fontSize:13,
        color:"#888", marginBottom:20 }}>{net.desc}</p>
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={onSwitch}
          style={{ flex:1, background:net.color, border:`3px solid ${net.color}`,
            color:"#000", padding:14, fontFamily:"Archivo Black, sans-serif",
            fontSize:13, cursor:"pointer" }}>
          SWITCH TO {net.label.toUpperCase()}
        </button>
        <button onClick={onClose}
          style={{ border:"3px solid #333", background:"transparent",
            color:"#666", padding:"14px 20px", fontFamily:"Archivo Black, sans-serif",
            fontSize:13, cursor:"pointer" }}>
          CANCEL
        </button>
      </div>
    </Modal>
  );
}