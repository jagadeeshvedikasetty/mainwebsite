"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductGrid({ products }: { products: any[] }) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        // Find the lowest price from variants if available
        let lowestPrice = "N/A";
        if (product.variants && product.variants.length > 0) {
          const prices = product.variants.map((v: any) => v.price);
          lowestPrice = `From ₹${Math.min(...prices)}.00`;
        }

        // Delay for staggered animation
        const delay = `${(index % 4 + 1) * 0.1}s`;

        return (
          <div key={product.id} className="product-card animate-fade-in" style={{ animationDelay: delay }}>
            <Link 
              href={`/shop/${product.id}`}
              className="product-image-container block"
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="product-image" 
                unoptimized // Because we use external Cloudinary URLs
              />
              
              {product.video_url && (
                <video 
                  src={product.video_url} 
                  className="product-image-hover" 
                  muted 
                  loop 
                  playsInline 
                  style={{ objectFit: 'cover', transform: `scale(${product.video_scale || 1.0})` }}
                />
              )}
              
              <div className="quick-shop-btn">Quick Shop</div>
            </Link>
            <div className="product-info">
              <div className="product-category">{product.category || "General"}</div>
              <Link href={`/shop/${product.id}`}>
                <h3 className="product-title font-traditional hover:text-orange-600 transition-colors">{product.name}</h3>
              </Link>
              <div className="product-price">{lowestPrice}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
