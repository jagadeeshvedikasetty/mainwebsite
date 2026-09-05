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

        <Link href="/" className="logo-link relative">
          <div id="hotspot-header-logo-left" className="hotspot-small absolute top-0 -left-6 z-50"></div>
          <Image src="/logo.png" alt="Janani Home Foods Logo" width={180} height={70} className="logo-img relative z-10" />
          <div id="hotspot-header-logo-right" className="hotspot-small absolute top-0 -right-6 z-50"></div>
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
