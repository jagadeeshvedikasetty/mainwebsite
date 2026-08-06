"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="logo-link">
          <Image src="/logo.png" alt="Janani Home Foods Logo" width={180} height={70} className="logo-img" />
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? '✕' : '☰'}
        </button>

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
          <button className="icon-btn" aria-label="Cart">🛒 (0)</button>
        </div>
      </div>
    </nav>
  );
}
