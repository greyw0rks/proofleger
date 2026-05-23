// generated: may21  component: GlobalStatsHero  desc: homepage hero with live global stats
export default function GlobalStatsHero({ data, onAction }) {
  if (!data) return null;
  return (
    <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: 16 }}>
      <div style={{ fontFamily: 'Archivo Black,sans-serif', fontSize: 13, letterSpacing: 1,
        textTransform: 'uppercase', color: '#f5f0e8', marginBottom: 12 }}>
        GlobalStatsHero
      </div>
      <pre style={{ fontFamily: 'Space Mono,monospace', fontSize: 11, color: '#888' }}>
        {JSON.stringify(data, null, 2)}
      </pre>
      {onAction && (
        <button onClick={onAction}
          style={{ marginTop: 12, padding: '8px 16px', background: '#F7931A',
            border: 'none', borderRadius: 6, color: '#0a0a0a', cursor: 'pointer' }}>
          Action
        </button>
      )}
    </div>
  );
}
