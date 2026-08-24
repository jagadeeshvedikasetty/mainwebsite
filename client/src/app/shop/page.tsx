"use client";

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../utils/supabase';

type Variant = {
  weight: string;
  price: number;
};

type Product = {
  id: number;
  name: string;
  category: string;
  variants: Variant[];
  image_url?: string;
  video_url?: string;
  video_scale?: number;
};

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  
  useEffect(() => {
    supabase.from('products').select('*').then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);
  
  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam.toUpperCase());
    }
  }, [categoryParam]);
  
  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === 'ALL' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <main>
      <section className="section bg-light">
        <div className="container">
          <h1 className="section-title font-traditional animate-slide-in">Our Menu</h1>
          
          <div className="category-filters animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((product, idx) => (
              <div 
                key={product.id} 
                className="product-card animate-fade-in" 
                style={{ animationDelay: `${0.1 + (idx % 10) * 0.1}s` }}
              >
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
                  <Image 
                    src={product.image_url || "/product.png"} 
                    alt={product.name} 
                    fill 
                    className="product-image" 
                    unoptimized 
                  />
                  {product.video_url ? (
                    <video 
                      src={product.video_url} 
                      className="product-image-hover" 
                      muted 
                      loop 
                      playsInline 
                      style={{ objectFit: 'cover', transform: `scale(${product.video_scale || 1.0})` }}
                    />
                  ) : (
                    <video 
                      src="/product-hover.mp4" 
                      className="product-image-hover" 
                      muted 
                      loop 
                      playsInline 
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                  <div className="quick-shop-btn">Quick Shop</div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-title font-traditional">{product.name}</h3>
                  
                  {/* Show price of first variant as 'From Rs...' */}
                  <div className="product-price">
                    From ₹{product.variants[0]?.price || '0'}.00
                  </div>

                  <div className="mt-auto">
                    <select className="variant-select">
                      {product.variants.map((v, i) => (
                        <option key={i} value={v.weight}>{v.weight} - ₹{v.price}</option>
                      ))}
                    </select>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
