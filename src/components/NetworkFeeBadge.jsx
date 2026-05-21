'use client';
export default function NetworkFeeBadge({ data, onAction }) {
  if (!data) return null;
  return (
    <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:10, padding:16 }}>
      <div style={{ fontFamily:'Archivo Black,sans-serif', fontSize:13, letterSpacing:1, textTransform:'uppercase', color:'#f5f0e8', marginBottom:12 }}>
        NetworkFeeBadge
      </div>
      <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:13, color:'#888' }}>
        {typeof data === 'string' ? data : JSON.stringify(data)}
      </div>
      {onAction && (
        <button onClick={onAction} style={{ marginTop:12, padding:'8px 16px', background:'#F7931A', border:'none', borderRadius:6, color:'#0a0a0a', cursor:'pointer', fontFamily:'Archivo Black,sans-serif', fontSize:11 }}>
          Action
        </button>
      )}
    </div>
  );
}