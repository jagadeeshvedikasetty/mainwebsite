"use client";

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { supabase } from '../../../utils/supabase';
import { useCartStore } from '../../../store/cartStore';

type Variant = {
  weight: string;
  price: number;
};

type Product = {
  id: string;
  name: string;
  category: string;
  variants: Variant[];
  image_url?: string;
  video_url?: string;
  ingredients?: string;
};

export default function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('id', resolvedParams.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProduct(data);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Loading...</div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>Product not found.</div>;
  }

  const selectedVariant = product.variants?.[selectedVariantIdx] || { weight: 'Standard', price: 0 };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      quantity,
      image_url: product.image_url,
      variant: selectedVariant.weight
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main style={{ padding: '60px 0', backgroundColor: 'var(--bg-color)' }}>
      <div className="container" style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* Product Media */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', position: 'relative', aspectRatio: '1/1', backgroundColor: '#f9f9f9' }}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="font-traditional" style={{ fontSize: '2.5rem', color: 'var(--heading-color)', marginBottom: '10px' }}>{product.name}</h1>
          <p style={{ color: '#666', marginBottom: '20px', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>{product.category}</p>
          
          <h2 style={{ fontSize: '1.8rem', color: 'var(--secondary-color)', marginBottom: '20px' }}>
            ₹{selectedVariant.price.toFixed(2)}
          </h2>

          {product.variants && product.variants.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select Weight</label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {product.variants.map((v, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedVariantIdx(idx)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: idx === selectedVariantIdx ? '2px solid var(--primary-color)' : '1px solid #ddd',
                      backgroundColor: idx === selectedVariantIdx ? 'rgba(255,153,51,0.1)' : 'white',
                      cursor: 'pointer',
                      fontWeight: idx === selectedVariantIdx ? 'bold' : 'normal'
                    }}
                  >
                    {v.weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 15px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
              >-</button>
              <div style={{ padding: '10px 20px', background: 'white', fontWeight: 'bold' }}>{quantity}</div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '10px 15px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              style={{
                padding: '12px 30px',
                backgroundColor: added ? 'var(--secondary-color)' : 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                flex: 1,
                transition: 'background-color 0.3s'
              }}
            >
              {added ? 'Added to Cart! ✓' : 'Add to Cart'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Ingredients</h3>
            <p style={{ lineHeight: '1.6', color: '#444' }}>
              {product.ingredients || 'Detailed ingredient list coming soon. Made with traditional, authentic recipes.'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
