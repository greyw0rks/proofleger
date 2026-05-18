'use client';
import { useState } from 'react';
import { useStaking } from '@/hooks/useStaking';

function StatBox({ label, value, color = '#f5f0e8' }) {
  return (
    <div style={{
      flex: 1, padding: '12px 16px',
      background: '#111', border: '1px solid #1a1a1a', borderRadius: 8,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <span style={{
        fontFamily: 'Space Mono, monospace', fontSize: 10,
        color: '#555', letterSpacing: 1, textTransform: 'uppercase',
      }}>{label}</span>
      <span style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 20, color }}>
        {value ?? '—'}
      </span>
    </div>
  );
}

export default function StakingPanel({ address }) {
  const { data: staking, loading } = useStaking(address);
  const [tab, setTab] = useState('overview');

  if (loading) return (
    <div style={{ color: '#555', fontFamily: 'Space Mono, monospace', fontSize: 12, padding: 24, textAlign: 'center' }}>
      Loading staking data…
    </div>
  );

  if (!staking) return null;

  const { amount_stacked, rewards_earned, lock_period, unlock_block, auto_renew } = staking;

  const TABS = ['overview', 'history'];
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 12px',
            background: tab === t ? '#1a1a1a' : 'none',
            border: '1px solid ' + (tab === t ? '#333' : '#1a1a1a'),
            borderRadius: 6, cursor: 'pointer',
            color: tab === t ? '#f5f0e8' : '#555',
            fontFamily: 'Space Mono, monospace',
            fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <StatBox label="Staked" value={amount_stacked ? `${(amount_stacked / 1e6).toFixed(2)} STX` : null} color="#F7931A" />
            <StatBox label="Rewards" value={rewards_earned ? `${(rewards_earned / 1e6).toFixed(4)} STX` : null} color="#00ff88" />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <StatBox label="Lock Period" value={lock_period ? `${lock_period} cycles` : null} />
            <StatBox label="Unlock Block" value={unlock_block ?? null} />
          </div>
          {auto_renew && (
            <div style={{
              marginTop: 10, padding: '8px 12px',
              background: 'rgba(247,147,26,0.08)', border: '1px solid rgba(247,147,26,0.2)',
              borderRadius: 6, fontFamily: 'Space Mono, monospace', fontSize: 11, color: '#F7931A',
            }}>
              ↻ Auto-renew enabled
            </div>
          )}
        </>
      )}

      {tab === 'history' && (
        <div style={{ color: '#555', fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, padding: '8px 0' }}>
          Staking history coming soon.
        </div>
      )}
    </div>
  );
}
