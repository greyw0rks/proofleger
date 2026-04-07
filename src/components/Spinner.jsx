"use client";
export default function Spinner({ size = 24, color = "#F7931A" }) {
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:size, height:size, border:`3px solid #333`, borderTop:`3px solid ${color}`, borderRadius:"50%", animation:"spin 0.8s linear infinite", display:"inline-block" }} />
    </>
  );
}
