'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',           label: 'Home',       icon: '⬡' },
  { href: '/anchor',     label: 'Anchor',     icon: '⚓' },
  { href: '/verify',     label: 'Verify',     icon: '✓' },
  { href: '/dashboard',  label: 'Dashboard',  icon: '◈' },
  { href: '/profile',    label: 'Profile',    icon: '◉' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastY || y < 60);
      setLastY(y);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastY]);

  return (
    <nav style={{
      display: 'none',
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,10,0.95)',
      borderTop: '1px solid #1a1a1a',
      backdropFilter: 'blur(12px)',
      zIndex: 900,
      padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
      transform: visible ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.25s ease',
      ['@media (maxWidth: 640px)']: { display: 'flex' },
    }}
      className="mobile-nav"
    >
      <style>{`
        @media (max-width: 640px) { .mobile-nav { display: flex !important; } }
      `}</style>
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        width: '100%', maxWidth: 480, margin: '0 auto',
      }}>
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 12px', textDecoration: 'none',
              color: active ? '#F7931A' : '#555',
              transition: 'color 0.15s',
            }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
              }}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
