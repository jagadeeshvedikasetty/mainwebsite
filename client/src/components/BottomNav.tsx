"use client";

import Link from 'next/link';
import './bottomNav.css';

export default function BottomNav() {
  return (
    <div className="bottom-nav">
      <Link href="/shop" className="bottom-nav-item">
        <span className="icon">☰</span>
        <span className="label">Menu</span>
      </Link>
      <Link href="/shop" className="bottom-nav-item">
        <span className="icon">🍲</span>
        <span className="label">Diabetic Friendly</span>
      </Link>
      <Link href="/shop?category=SWEETS" className="bottom-nav-item">
        <span className="icon">🔥</span>
        <span className="label">Hot Sale</span>
      </Link>
      <Link href="/shop" className="bottom-nav-item">
        <span className="icon">✈️</span>
        <span className="label">International</span>
      </Link>
    </div>
  );
}
