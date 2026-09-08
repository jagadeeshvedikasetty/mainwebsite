'use client'

import { useCartStore } from '../../store/cartStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { placeOrder } from './actions'

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <button onClick={() => router.push('/shop')} className="px-6 py-2 bg-orange-600 text-white rounded">
          Continue Shopping
        </button>
      </div>
    )
  }

  const total = getTotalPrice()

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    formData.append('cartData', JSON.stringify(items))
    // Call server action
    try {
      await placeOrder(formData)
      clearCart() // if successful, the action will redirect, but we clear it anyway
    } catch (err) {
      // Server actions redirect internally, this block might not execute if redirected.
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px', minHeight: '70vh' }}>
      <h1 className="font-traditional" style={{ fontSize: '2.5rem', marginBottom: '30px', color: 'var(--heading-color)' }}>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
        
        {/* Shipping Form */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Shipping Information</h2>
          <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Full Delivery Address</label>
              <textarea 
                name="address"
                required
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', fontFamily: 'inherit' }}
                placeholder="123 Main St, Apt 4B, City, State, ZIP"
              ></textarea>
            </div>
            
            <div style={{ backgroundColor: '#f0f7ff', color: '#0369a1', padding: '15px', borderRadius: '4px', fontSize: '0.9rem', border: '1px solid #bae6fd' }}>
              <strong>Note:</strong> We are currently only accepting Cash on Delivery (COD) for testing purposes.
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ width: '100%', padding: '15px', backgroundColor: 'var(--secondary-color)', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '15px', cursor: 'pointer' }}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ backgroundColor: '#fafafa', padding: '30px', borderRadius: '8px', border: '1px solid #eee', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
            {items.map(item => (
              <div key={`${item.id}-${item.variant}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#333' }}>{item.name}</span>
                  <span style={{ color: '#888', marginLeft: '8px' }}>x{item.quantity}</span>
                </div>
                <span style={{ fontWeight: '500', color: '#111' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--heading-color)' }}>
            <span>Total to Pay:</span>
            <span style={{ color: 'var(--primary-color)' }}>₹{total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
