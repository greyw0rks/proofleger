"use client";

/**
 * NetworkSwitcher - Toggle between Stacks and Celo networks
 *
 * @param {{ network: "stacks"|"celo", onChange: function }} props
 */
export default function NetworkSwitcher({ network, onChange }) {
  const networks = [
    { id: "stacks", label: "STACKS", sub: "Bitcoin L2" },
    { id: "celo",   label: "CELO",   sub: "MiniPay" },
  ];

  return (
    <div style={{ display: "flex", gap: "0", marginBottom: "0" }}>
      {networks.map((n) => {
        const active = network === n.id;
        return (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            style={{
              padding: "10px 24px",
              background: active ? "#F7931A" : "transparent",
              color: active ? "#0a0a0a" : "#f5f0e8",
              border: "3px solid " + (active ? "#F7931A" : "#f5f0e8"),
              borderRight: n.id === "stacks" ? "none" : "3px solid " + (active ? "#F7931A" : "#f5f0e8"),
              fontFamily: "Archivo Black, sans-serif",
              fontSize: "13px",
              cursor: "pointer",
              letterSpacing: "1px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2px",
              transition: "all 0.1s",
              boxShadow: active ? "3px 3px 0px #d4780f" : "none",
            }}
          >
            <span>{n.label}</span>
            <span style={{ fontSize: "9px", opacity: 0.7, fontFamily: "Space Mono, monospace", fontWeight: "normal" }}>
              {n.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
}
