"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../store/cartStore';
import './navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <Link href="/" className="logo-link" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', textDecoration: 'none' }}>
          <div id="hotspot-header-logo-left" className="hotspot-small" style={{ position: 'absolute', top: 0, left: '-24px', zIndex: 50 }}></div>
          
          <svg className="rotating-text-svg" viewBox="0 0 100 100">
            <defs>
              <path id="circlePath" d="M 50, 50 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
            </defs>
            <text fontSize="11" fontWeight="bold" letterSpacing="1.8" fill="#d97706">
              <textPath href="#circlePath" startOffset="0%">
                JANANI HOME FOODS • AUTHENTIC TASTE • 
              </textPath>
            </text>
          </svg>
          
          <Image src="/logo.png" alt="Janani Home Foods Logo" width={65} height={65} className="logo-img" style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', padding: '4px', objectFit: 'contain' }} />
          
          <div id="hotspot-header-logo-right" className="hotspot-small" style={{ position: 'absolute', top: 0, right: '-24px', zIndex: 50 }}></div>
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
          <Link href="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>Best Sellers</Link>
          <Link href="/shop?category=SWEETS" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sweets</Link>
          <Link href="/shop?category=PICKLES" className="nav-link" onClick={() => setIsMenuOpen(false)}>Pickles</Link>
          <Link href="/shop" className="nav-link" onClick={() => setIsMenuOpen(false)}>All Collections</Link>
        </div>
        
        <div className="nav-actions">
          <button className="icon-btn" aria-label="Search">🔍</button>
          <button className="icon-btn" aria-label="Account">👤</button>
          <Link href="/cart" className="icon-btn" aria-label="Cart" style={{ textDecoration: 'none' }}>🛒 <span>({mounted ? totalItems : 0})</span></Link>
        </div>
      </div>
    </nav>
  );
}
