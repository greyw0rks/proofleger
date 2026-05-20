const COLORS = { platinum:"#a78bfa", gold:"#FCFF52", audited:"#F7931A", verified:"#00ff88", standard:"#888" };
export default function StampBadge({ stamp, size = "sm" }) {
  if (!stamp) return null;
  const color = COLORS[stamp.level] ?? COLORS.standard;
  const pad = size === "lg" ? "6px 14px" : "3px 8px";
  const fs = size === "lg" ? 12 : 10;
  return (
    <span style={{ padding:pad, borderRadius:4, fontSize:fs, fontFamily:"Space Mono,monospace", letterSpacing:1, background:`${color}18`, color, border:`1px solid ${color}`, textTransform:"uppercase" }}>
      ✦ {stamp.level}
    </span>
  );
}