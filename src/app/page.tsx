"use client";

import Link from "next/link";
import Image from "next/image";
import CategoryScroll from "../components/CategoryScroll";

export default function Home() {
  return (
    <main>
      <CategoryScroll />
      <section className="hero">
        <Image src="/hero.png" alt="Janani Home Foods Traditional Sweets" fill priority className="hero-img" />
        <div className="hero-content animate-fade-in">
          <h1 className="hero-title font-traditional">Monsoon Sale!</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px', fontWeight: 300, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
            Enjoy the cozy weather with our traditional homemade sweets and snacks. Special discounts available for a limited time!
          </p>
          <Link href="/shop" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '15px 40px' }}>
            Shop the Sale
          </Link>
        </div>
      </section>

      <section id="featured" className="section">
        <div className="container">
          <h2 className="section-title font-traditional">Our Best Sellers</h2>
          <div className="products-grid">
            {/* Sample Best Sellers */}
            <div className="product-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div 
                className="product-image-container"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <Image src="/product.png" alt="Bellam Boondi Laddu" fill className="product-image" />
                <video 
                  src="/product-hover.mp4" 
                  className="product-image-hover" 
                  muted 
                  loop 
                  playsInline 
                  style={{ objectFit: 'cover' }}
                />
                <div className="quick-shop-btn">Quick Shop</div>
              </div>
              <div className="product-info">
                <div className="product-category">SWEETS</div>
                <h3 className="product-title font-traditional">Bellam Boondi Laddu</h3>
                <div className="product-price">From ₹130.00</div>
              </div>
            </div>

            <div className="product-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div 
                className="product-image-container"
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
                <Image src="/product.png" alt="Avakaaya Pickle" fill className="product-image" />
                <video 
                  src="/product-hover.mp4" 
                  className="product-image-hover" 
                  muted 
                  loop 
                  playsInline 
                  style={{ objectFit: 'cover' }}
                />
                <div className="quick-shop-btn">Quick Shop</div>
              </div>
              <div className="product-info">
                <div className="product-category">PICKLES</div>
                <h3 className="product-title font-traditional">Avakaaya Pickle</h3>
                <div className="product-price">From ₹135.00</div>
              </div>
            </div>

            <div 
                className="product-card animate-fade-in" 
                style={{ animationDelay: '0.3s' }}
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
              <div className="product-image-container">
                <Image src="/product.png" alt="Palli Chekkalu" fill className="product-image" />
                <video 
                  src="/product-hover.mp4" 
                  className="product-image-hover" 
                  muted 
                  loop 
                  playsInline 
                  style={{ objectFit: 'cover' }}
                />
                <div className="quick-shop-btn">Quick Shop</div>
              </div>
              <div className="product-info">
                <div className="product-category">SNACKS</div>
                <h3 className="product-title font-traditional">Palli Chekkalu</h3>
                <div className="product-price">From ₹130.00</div>
              </div>
            </div>

            <div 
                className="product-card animate-fade-in" 
                style={{ animationDelay: '0.4s' }}
                onMouseEnter={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) video.play();
                }}
                onMouseLeave={(e) => {
                  const video = e.currentTarget.querySelector('video');
                  if (video) {
                    video.pause();
                    video.currentTime = 0;
                  }
                }}
              >
              <div className="product-image-container">
                <Image src="/product.png" alt="Kharjoora Nuvvula Laddu" fill className="product-image" />
                <video 
                  src="/product-hover.mp4" 
                  className="product-image-hover" 
                  muted 
                  loop 
                  playsInline 
                  style={{ objectFit: 'cover' }}
                />
                <div className="quick-shop-btn">Quick Shop</div>
              </div>
              <div className="product-info">
                <div className="product-category">SWEETS</div>
                <h3 className="product-title font-traditional">Kharjoora Nuvvula Laddu</h3>
                <div className="product-price">From ₹200.00</div>
              </div>
            </div>
          </div>
          
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
      <section className="section" style={{ backgroundColor: 'white' }}>
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
