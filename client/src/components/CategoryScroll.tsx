"use client";

import Link from 'next/link';
import Image from 'next/image';
import './categoryScroll.css';

const categories = [
  { name: 'Best Sellers', link: '/shop', img: '/product.png' },
  { name: 'Super Savers', link: '/shop', img: '/product.png' },
  { name: 'Sweets', link: '/shop?category=SWEETS', img: '/product.png' },
  { name: 'Diabetic Friendly', link: '/shop', img: '/product.png' },
  { name: 'Pickles', link: '/shop?category=PICKLES', img: '/product.png' },
  { name: 'Snacks', link: '/shop?category=SNACKS', img: '/product.png' },
];

export default function CategoryScroll() {
  return (
    <div className="category-scroll-container">
      <div className="category-scroll">
        {categories.map((cat, idx) => (
          <Link href={cat.link} key={idx} className="category-item">
            <div className="category-circle">
              <Image src={cat.img} alt={cat.name} fill sizes="100px" className="category-img" />
            </div>
            <span className="category-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
