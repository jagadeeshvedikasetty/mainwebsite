"use client";

import { useState } from 'react';
import itemsData from '../../data/items.json';

type Variant = {
  weight: string;
  price: number;
};

type Product = {
  id: number;
  name: string;
  category: string;
  variants: Variant[];
};

export default function AdminDashboard() {
  const [products] = useState<Product[]>(itemsData as Product[]);

  return (
    <main>
      <section className="section bg-light" style={{ minHeight: '80vh' }}>
        <div className="container">
          <h1 className="section-title animate-slide-in">Admin Dashboard</h1>
          <p className="hero-subtitle text-center mb-4">Manage your products and view inventory.</p>

          <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee' }}>
                    <th style={{ padding: '15px' }}>ID</th>
                    <th style={{ padding: '15px' }}>Name</th>
                    <th style={{ padding: '15px' }}>Category</th>
                    <th style={{ padding: '15px' }}>Variants (Weight - Price)</th>
                    <th style={{ padding: '15px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '15px' }}>{product.id}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold' }}>{product.name}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ backgroundColor: 'var(--accent-color)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>
                        {product.variants.map((v, i) => (
                          <div key={i}>{v.weight} - ₹{v.price}</div>
                        ))}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <button className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '0.85rem' }}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
