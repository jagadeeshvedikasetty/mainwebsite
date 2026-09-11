"use client";

import { useCartStore } from '../../store/cartStore';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { placeOrder, createRazorpayOrder } from './actions';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = getTotalPrice();

  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Calculate total
      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 2. Create Razorpay order via Server Action
      const { success, order } = await createRazorpayOrder(totalAmount);
      if (!success || !order) {
        alert("Could not initialize payment");
        setIsSubmitting(false);
        return;
      }

      // 3. Configure Razorpay Window
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount, 
        currency: order.currency,
        name: "Janani Home Foods",
        description: "Order Payment",
        order_id: order.id, 
        handler: async function (response: any) {
          // 4. On Payment Success, call your existing placeOrder action
          const formData = new FormData();
          formData.append('cartData', JSON.stringify(items));
          formData.append('razorpay_payment_id', response.razorpay_payment_id);
          formData.append('razorpay_order_id', response.razorpay_order_id);
          formData.append('razorpay_signature', response.razorpay_signature);

          try {
            const result = await placeOrder(formData);
            if (result.success) {
              setShowAnimation(true);
              setTimeout(() => {
                clearCart();
                router.push('/account?message=Order placed successfully!');
              }, 2500);
            } else {
              alert(result.message || 'Failed to place order');
              setIsSubmitting(false);
            }
          } catch (err) {
            console.error(err);
            alert('An unexpected error occurred during order placement.');
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: "Customer Name", // Would pull from session in real app
          email: "customer@example.com",
        },
        theme: {
          color: "#f97316", // match UI orange
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      // @ts-ignore
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response: any){
        alert("Payment failed: " + response.error.description);
        setIsSubmitting(false);
      });
      rzp1.open();
    } catch (err) {
      console.error(err);
      alert('An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  if (items.length === 0) {
    return (
      <main style={{ padding: '80px 20px', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="font-traditional" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Your Cart</h1>
        <p style={{ marginBottom: '30px', color: '#666' }}>Your cart is currently empty.</p>
        <Link href="/shop" style={{ padding: '12px 30px', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main style={{ padding: '60px 0', backgroundColor: 'var(--bg-color)', minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <h1 className="font-traditional" style={{ fontSize: '2.5rem', color: 'var(--heading-color)', marginBottom: '30px' }}>Your Cart</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {/* Cart Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 2fr 1fr', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#666', fontSize: '0.9rem' }}>
              <div>Product</div>
              <div>Price</div>
              <div style={{ textAlign: 'center' }}>Quantity</div>
              <div style={{ textAlign: 'right' }}>Total</div>
            </div>

            {items.map((item) => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 2fr 1fr', gap: '15px', padding: '20px 0', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {item.image_url ? (
                    <div style={{ width: '60px', height: '60px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                      <Image src={item.image_url} alt={item.name} fill style={{ objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
                  )}
                  <div>
                    <Link href={`/shop/${item.id}`} style={{ fontWeight: 'bold', color: 'var(--heading-color)', textDecoration: 'none', fontSize: '1.1rem' }}>
                      {item.name}
                    </Link>
                    {item.variant && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>Variant: {item.variant}</div>}
                    <button 
                      onClick={() => removeFromCart(item.id, item.variant)}
                      style={{ background: 'none', border: 'none', color: '#e74c3c', fontSize: '0.8rem', marginTop: '8px', cursor: 'pointer', padding: 0 }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div style={{ fontWeight: '500' }}>₹{item.price.toFixed(2)}</div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', width: 'fit-content' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                      style={{ padding: '5px 12px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
                    >-</button>
                    <div style={{ padding: '5px 15px', background: 'white', fontWeight: 'bold' }}>{item.quantity}</div>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                      style={{ padding: '5px 12px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
                    >+</button>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button onClick={clearCart} style={{ background: 'none', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666' }}>
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: '#666' }}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #eee', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary-color)' }}>₹{total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isSubmitting || showAnimation}
              style={{ display: 'block', textAlign: 'center', width: '100%', padding: '15px', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '30px', cursor: (isSubmitting || showAnimation) ? 'not-allowed' : 'pointer', transition: 'opacity 0.3s', textDecoration: 'none' }}
            >
              {isSubmitting ? 'Placing Order...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', animation: 'scaleIn 0.5s ease-out' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'drawCheck 0.5s ease-out 0.3s both' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '2rem', color: '#10b981', fontWeight: 'bold', fontFamily: 'inherit', animation: 'fadeInUp 0.5s ease-out 0.5s both' }}>Order Placed Successfully!</h2>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scaleIn {
              0% { transform: scale(0); }
              100% { transform: scale(1); }
            }
            @keyframes drawCheck {
              0% { stroke-dasharray: 50; stroke-dashoffset: 50; }
              100% { stroke-dasharray: 50; stroke-dashoffset: 0; }
            }
            @keyframes fadeInUp {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}} />
        </div>
      )}
    </main>
  );
}
