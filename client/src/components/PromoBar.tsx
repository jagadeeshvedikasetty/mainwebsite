"use client";

import Link from 'next/link';

export default function PromoBar() {
  return (
    <div style={{
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      padding: '8px 15px',
      textAlign: 'center',
      fontSize: '0.85rem',
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
      position: 'relative',
      zIndex: 1001
    }}>
      <span>🎉</span>
      <Link href="/shop" style={{ color: 'white', textDecoration: 'none' }}>
        Newly launched: Maha Combo Pack. Click to Order Now!
      </Link>
    </div>
  );
}
