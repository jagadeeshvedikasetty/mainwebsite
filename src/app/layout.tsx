import type { Metadata, Viewport } from "next";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import PromoBar from "../components/PromoBar";
import BottomNav from "../components/BottomNav";
import FloatingActions from "../components/FloatingActions";
import ThemeProvider from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Janani Home Foods - Authentic Indian Sweets & Pickles",
  description: "Authentic Indian Home Foods, Sweets, Snacks, and Pickles since 1997",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <PromoBar />
        <Navbar />
        {children}
        
        <footer style={{ backgroundColor: 'var(--bg-color)', padding: '60px 0', borderTop: '1px solid var(--border-color)', marginTop: '40px' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
            <div style={{ maxWidth: '300px' }}>
              <Image src="/logo.png" alt="Janani Home Foods" width={150} height={60} style={{ marginBottom: '20px' }} />
              <p style={{ fontSize: '0.9rem' }}>Authentic taste of tradition. Handcrafted sweets, snacks, and pickles made with love.</p>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }} className="font-traditional">Quick Links</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/shop">Shop All</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginBottom: '20px' }} className="font-traditional">Information</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <li><Link href="/shipping">Shipping Policy</Link></li>
                <li><Link href="/returns">Return Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </footer>
        </ThemeProvider>
        <FloatingActions />
      </body>
    </html>
  );
}
