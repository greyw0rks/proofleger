"use client";

const ICONS = {
  stacks: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="2" fill="#F7931A" fillOpacity="0.12"/>
      <path d="M4 10.5h8M4 8h8M6 5.5l2-2 2 2" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  celo: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="7" fill="#FCFF52" fillOpacity="0.12"/>
      <circle cx="8" cy="8" r="4" stroke="#FCFF52" strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="1.5" fill="#FCFF52"/>
    </svg>
  ),
};

export default function ChainIcon({ chain, size = 16 }) {
  const icon = ICONS[chain];
  if (!icon) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", width: size, height: size }}>
      {icon}
    </span>
  );
}