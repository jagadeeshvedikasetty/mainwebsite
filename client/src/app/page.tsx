import Link from "next/link";
import Image from "next/image";
import CategoryScroll from "../components/CategoryScroll";
import ProductGrid from "../components/ProductGrid";
import DecorationOverlay from '../components/DecorationOverlay';
import DraggableHeroText from '../components/DraggableHeroText';
import { supabase } from "../utils/supabase";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: products } = await supabase.from('products').select('*').limit(8);
  const { data: themeData } = await supabase.from('themes').select('*').eq('id', 'active_theme').maybeSingle();
  const desktopSrc = themeData?.hero_image_url || '/hero.png';
  const mobileSrc = themeData?.mobile_hero_image_url || desktopSrc;
  
  const heroTitle = themeData?.hero_title || 'Monsoon Sale!';
  const heroSubtitle = themeData?.hero_subtitle || 'Enjoy the cozy weather with our traditional homemade sweets and snacks. Special discounts available for a limited time!';
  const heroButtonText = themeData?.hero_button_text || 'Shop the Sale';
  const heroButtonLink = themeData?.hero_button_link || '/shop';
  const scaleDesktop = themeData?.hero_text_scale_desktop || 1.0;
  const scaleMobile = themeData?.hero_text_scale_mobile || 1.0;
  const xDesktop = themeData?.hero_text_x_desktop ?? 50;
  const yDesktop = themeData?.hero_text_y_desktop ?? 50;
  const xMobile = themeData?.hero_text_x_mobile ?? 50;
  const yMobile = themeData?.hero_text_y_mobile ?? 50;

  const showTextDesktop = themeData?.hero_text_show_desktop ?? true;
  const showTextMobile = themeData?.hero_text_show_mobile ?? true;
  const showButtonDesktop = themeData?.hero_button_show_desktop ?? true;
  const showButtonMobile = themeData?.hero_button_show_mobile ?? true;

  return (
    <main>
      <CategoryScroll />
      <section className="hero">
        <div className="hero-bg-desktop">
          <Image src={desktopSrc} alt="Janani Home Foods Traditional Sweets" fill priority className="hero-img" unoptimized={desktopSrc.startsWith('http')} />
        </div>
        <div className="hero-bg-mobile">
          <Image src={mobileSrc} alt="Janani Home Foods Traditional Sweets" fill priority className="hero-img" unoptimized={mobileSrc.startsWith('http')} />
        </div>
        <DraggableHeroText 
          title={heroTitle}
          subtitle={heroSubtitle}
          buttonText={heroButtonText}
          buttonLink={heroButtonLink}
          scaleDesktop={scaleDesktop}
          scaleMobile={scaleMobile}
          xDesktop={xDesktop}
          yDesktop={yDesktop}
          xMobile={xMobile}
          yMobile={yMobile}
          showTextDesktop={showTextDesktop}
          showTextMobile={showTextMobile}
          showButtonDesktop={showButtonDesktop}
          showButtonMobile={showButtonMobile}
        />
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
