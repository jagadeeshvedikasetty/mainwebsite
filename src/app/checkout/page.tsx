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
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-8 text-[#4a2e1b]">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Shipping Information</h2>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Delivery Address</label>
              <textarea 
                name="address"
                required
                rows={4}
                className="w-full border border-gray-300 rounded p-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="123 Main St, Apt 4B, City, State, ZIP"
              ></textarea>
            </div>
            
            <div className="bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-100">
              <strong>Note:</strong> We are currently only accepting Cash on Delivery (COD) for testing purposes.
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded mt-6 transition-colors"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map(item => (
              <div key={`${item.id}-${item.variant}`} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.quantity}</span>
                </div>
                <span className="text-gray-900 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
            <span>Total to Pay:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
