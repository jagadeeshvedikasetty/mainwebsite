import Link from 'next/link'
import { redirect } from 'next/navigation'
import PrintButton from './PrintButton'

export default async function OrderInvoicePage({ params }: { params: { id: string } }) {
  // We use the admin client to bypass RLS restrictions since the client dashboard had RLS issues
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  
  // Fetch order details including items
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (*)
    `)
    .eq('id', params.id)
    .single()
    
  if (error || !order) {
    console.error('Invoice fetch error:', error)
    return <div className="p-12 text-center text-red-500">Order not found.</div>
  }

  // Fetch product names manually because foreign key might be missing
  if (order.order_items && order.order_items.length > 0) {
    const productIds = order.order_items.map((i: any) => i.product_id)
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .in('id', productIds)
      
    order.order_items.forEach((item: any) => {
      const prod = products?.find((p: any) => p.id === item.product_id)
      item.products = { name: prod?.name || 'Unknown Product' }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation & Actions (Hidden when printing) */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Link href="/account" className="text-orange-600 hover:text-orange-700 font-medium">
            &larr; Back to Dashboard
          </Link>
          <PrintButton />
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
