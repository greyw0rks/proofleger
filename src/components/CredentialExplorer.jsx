'use client';
import { useState } from 'react';
import { useCredentials } from '@/hooks/useCredentials';
import CredentialCard from './CredentialCard';

const TABS = ['holder', 'issuer'];

export default function CredentialExplorer({ address }) {
  const [tab, setTab] = useState('holder');
  const [selectedChain, setSelectedChain] = useState('stacks');
  const { credentials, bySchema, loading, error } = useCredentials(address, { type: tab, chain: selectedChain });

  const schemas = Object.keys(bySchema);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 14px',
              background: tab === t ? '#F7931A' : '#1a1a1a',
              border: tab === t ? 'none' : '1px solid #2a2a2a',
              borderRadius: 6, cursor: 'pointer',
              color: tab === t ? '#0a0a0a' : '#888',
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
            }}>{t}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
          {['stacks', 'celo'].map(c => (
            <button key={c} onClick={() => setSelectedChain(c)} style={{
              padding: '5px 10px',
              background: selectedChain === c ? (c === 'celo' ? '#FCFF52' : '#F7931A') : '#1a1a1a',
              border: 'none', borderRadius: 5, cursor: 'pointer',
              color: selectedChain === c ? '#0a0a0a' : '#555',
              fontFamily: 'Space Mono, monospace', fontSize: 10,
              textTransform: 'uppercase',
            }}>{c}</button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {!loading && credentials.length > 0 && (
        <div style={{
          display: 'flex', gap: 16, padding: '10px 14px',
          background: '#111', border: '1px solid #1a1a1a', borderRadius: 8,
        }}>
          {[
            ['Total', credentials.length],
            ['Schemas', schemas.length],
            ['Active', credentials.filter(c => !c.revoked).length],
          ].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: '#555', letterSpacing: 1 }}>
                {label.toUpperCase()}
              </span>
              <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 18, color: '#F7931A' }}>
                {val}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Schema groups */}
      {loading && (
        <div style={{ color: '#555', fontFamily: 'Space Mono, monospace', fontSize: 12, textAlign: 'center', padding: 24 }}>
          Loading…
        </div>
      )}
      {error && (
        <div style={{ color: '#ff3333', fontFamily: 'Space Mono, monospace', fontSize: 12 }}>{error}</div>
      )}
      {!loading && schemas.length === 0 && (
        <div style={{ color: '#555', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, textAlign: 'center', padding: 24 }}>
          No credentials found as {tab}
        </div>
      )}
      {schemas.map(schema => (
        <div key={schema}>
          <div style={{
            fontFamily: 'Space Mono, monospace', fontSize: 10,
            color: '#555', letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            {schema} · {bySchema[schema].length}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {bySchema[schema].map((cred, i) => (
              <CredentialCard key={cred.credential_hash ?? i} credential={cred} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
