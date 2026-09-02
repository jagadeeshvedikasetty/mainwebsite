import Link from "next/link";
import Image from "next/image";
import CategoryScroll from "../components/CategoryScroll";
import ProductGrid from "../components/ProductGrid";
import DecorationOverlay from '../components/DecorationOverlay';
import { supabase } from "../utils/supabase";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').limit(8);
  const { data: themeData } = await supabase.from('themes').select('*').eq('id', 'active_theme').maybeSingle();
  const desktopSrc = themeData?.hero_image_url || '/hero.png';
  const mobileSrc = themeData?.mobile_hero_image_url || desktopSrc;
  
  const desktopHeight = themeData?.hero_desktop_height ?? 100;
  const mobileHeight = themeData?.hero_mobile_height ?? 60;
  const desktopPos = themeData?.hero_desktop_position ?? 'center';
  const mobilePos = themeData?.hero_mobile_position ?? 'center';

  return (
    <main>
      <CategoryScroll />
      <section className="hero">
        <div className="hero-bg-desktop" style={{ height: `${desktopHeight}vh` }}>
          <Image src={desktopSrc} alt="Janani Home Foods Traditional Sweets" fill priority className="hero-img" unoptimized={desktopSrc.startsWith('http')} style={{ objectFit: 'cover', objectPosition: desktopPos }} />
        </div>
        <div className="hero-bg-mobile" style={{ height: `${mobileHeight}vh` }}>
          <Image src={mobileSrc} alt="Janani Home Foods Traditional Sweets" fill priority className="hero-img" unoptimized={mobileSrc.startsWith('http')} style={{ objectFit: 'cover', objectPosition: mobilePos }} />
        </div>
      </section>

      <section id="featured" className="section">
        <div className="container">
          <h2 className="section-title font-traditional">Our Best Sellers</h2>
          <ProductGrid products={products || []} />
          
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link href="/shop" className="btn btn-outline">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Cinematic Video Section */}
      <section className="video-section">
        <iframe 
          className="video-background"
          src="https://www.youtube.com/embed/QtHsh_5Czh4?autoplay=1&mute=1&loop=1&playlist=QtHsh_5Czh4&controls=0&showinfo=0&autohide=1&modestbranding=1" 
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ pointerEvents: 'none', transform: 'scale(1.5)' }}
        ></iframe>
        <div className="video-overlay-content animate-fade-in">
          <h2 className="font-traditional">The Taste of Home</h2>
          <p>
            For 27 years, we have been crafting authentic South Indian delicacies 
            using traditional methods, ensuring the highest standards of hygiene and 
            that true homemade taste in every single bite.
          </p>
        </div>
      </section>

      {/* Our Collections Section equivalent */}
      <section className="section">
        <div className="container">
          <h2 className="section-title font-traditional">Our Collections</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            
            <Link href="/shop?category=SWEETS" className="product-card" style={{ textDecoration: 'none' }}>
              <div className="product-image-container" style={{ paddingTop: '70%' }}>
                <Image src="/product.png" alt="Sweets Collection" fill className="product-image" />
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 className="font-traditional" style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--text-dark)' }}>Sweets</h3>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500 }}>View All &#8594;</span>
              </div>
            </Link>

            <Link href="/shop?category=SNACKS" className="product-card" style={{ textDecoration: 'none' }}>
              <div className="product-image-container" style={{ paddingTop: '70%' }}>
                <Image src="/product.png" alt="Snacks Collection" fill className="product-image" />
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 className="font-traditional" style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--text-dark)' }}>Snacks</h3>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500 }}>View All &#8594;</span>
              </div>
            </Link>

            <Link href="/shop?category=PICKLES" className="product-card" style={{ textDecoration: 'none' }}>
              <div className="product-image-container" style={{ paddingTop: '70%' }}>
                <Image src="/product.png" alt="Pickles Collection" fill className="product-image" />
              </div>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <h3 className="font-traditional" style={{ fontSize: '1.5rem', marginBottom: '5px', color: 'var(--text-dark)' }}>Pickles</h3>
                <span style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 500 }}>View All &#8594;</span>
              </div>
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}
