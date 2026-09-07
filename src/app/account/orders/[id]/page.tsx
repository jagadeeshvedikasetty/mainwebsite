'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function OrderInvoicePage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      // Fetch order details including items
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers (*),
          order_items (
            *,
            products (name, price)
          )
        `)
        .eq('id', params.id)
        .single()
        
      if (data) {
        setOrder(data)
      }
      setLoading(false)
    }

    fetchOrder()
  }, [params.id])

  if (loading) return <div className="p-12 text-center text-gray-500">Loading invoice...</div>
  if (!order) return <div className="p-12 text-center text-red-500">Order not found.</div>

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Actions (Hidden when printing) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link href="/account" className="text-orange-600 hover:text-orange-700 font-medium">
            &larr; Back to Dashboard
          </Link>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            Print / Save PDF
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 shadow-sm print:border-none print:shadow-none print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold text-orange-600">Janani Home Foods</h1>
              <p className="text-sm text-gray-500 mt-1">Authentic Indian Sweets & Pickles</p>
              <div className="mt-4 text-sm text-gray-600">
                <p>123 Traditional Street</p>
                <p>Hyderabad, TS 500001</p>
                <p>contact@jananihomefoods.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Invoice</h2>
              <p className="text-gray-500 mt-1">#{order.id.split('-')[0].toUpperCase()}</p>
              <p className="text-sm text-gray-600 mt-4">Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-sm font-medium text-gray-900 capitalize mt-1">Status: {order.status || 'Pending'}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-8 border-b border-gray-200 pb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-semibold text-gray-900">{order.customers?.name}</p>
            <p className="text-sm text-gray-600 mt-1">{order.customers?.email}</p>
            <p className="text-sm text-gray-600">{order.customers?.phone}</p>
            <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
              {order.shipping_address || order.customers?.address || 'Shipping address not provided.'}
            </p>
          </div>

          {/* Line Items */}
          <table className="w-full text-left mb-8">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="py-3 text-sm font-bold text-gray-900">Item</th>
                <th className="py-3 text-sm font-bold text-gray-900 text-center">Qty</th>
                <th className="py-3 text-sm font-bold text-gray-900 text-right">Price</th>
                <th className="py-3 text-sm font-bold text-gray-900 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-4 text-sm text-gray-800">{item.products?.name || 'Unknown Product'}</td>
                  <td className="py-4 text-sm text-gray-600 text-center">{item.quantity}</td>
                  <td className="py-4 text-sm text-gray-600 text-right">₹{item.price_at_time}</td>
                  <td className="py-4 text-sm font-medium text-gray-900 text-right">
                    ₹{(item.quantity * item.price_at_time).toFixed(2)}
                  </td>
                </tr>
              ))}
              {(!order.order_items || order.order_items.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 italic">No line items found for this order.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-1/2 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.total_amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
            Thank you for shopping with Janani Home Foods! 
          </div>
        </div>
      </div>
    </div>
  )
}
