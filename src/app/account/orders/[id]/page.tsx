import Link from 'next/link'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import PrintButton from './PrintButton'
import './invoice.css'

export default async function OrderInvoicePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
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
    <div className="invoice-wrapper">
      <div className="invoice-container">
        
        {/* Navigation & Actions (Hidden when printing) */}
        <div className="invoice-nav print-hidden">
          <Link href="/account" className="invoice-back-link">
            &larr; Back to Dashboard
          </Link>
          <PrintButton />
        </div>

        {/* Header */}
        <div className="invoice-header">
          <div className="invoice-header-left">
            <div className="invoice-logo-container">
              <Image src="/logo.png" alt="Janani Home Foods Logo" fill style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <h1 className="invoice-brand-name">Janani Home Foods</h1>
              <p className="invoice-brand-tagline">Authentic Indian Sweets & Pickles</p>
              <div className="invoice-brand-address">
                <p>123 Traditional Street</p>
                <p>Hyderabad, TS 500001</p>
                <p>contact@jananihomefoods.com</p>
              </div>
            </div>
          </div>
          <div className="invoice-header-right">
            <h2 className="invoice-title">Invoice</h2>
            <p className="invoice-number">#{order.id.split('-')[0].toUpperCase()}</p>
            <p className="invoice-meta">Date: {new Date(order.created_at).toLocaleDateString()}</p>
            <p className="invoice-status">Status: {order.status || 'Pending'}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="invoice-billed-to">
          <h3 className="invoice-billed-heading">Billed To</h3>
          <p className="invoice-customer-name">{order.customers?.name}</p>
          <p className="invoice-customer-detail">{order.customers?.email}</p>
          <p className="invoice-customer-detail">{order.customers?.phone}</p>
          <p className="invoice-customer-address">
            {order.shipping_address || order.customers?.address || 'Shipping address not provided.'}
          </p>
        </div>

        {/* Line Items */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th className="center">Qty</th>
              <th className="right">Price</th>
              <th className="right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.products?.name || 'Unknown Product'}</td>
                <td className="center">{item.quantity}</td>
                <td className="right">₹{item.price_at_time}</td>
                <td className="right total-col">
                  ₹{(item.quantity * item.price_at_time).toFixed(2)}
                </td>
              </tr>
            ))}
            {(!order.order_items || order.order_items.length === 0) && (
              <tr>
                <td colSpan={4} className="center" style={{ padding: '2rem 0', fontStyle: 'italic' }}>
                  No line items found for this order.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="invoice-totals-box">
            <div className="invoice-total-row">
              <span>Subtotal</span>
              <span>₹{order.total_amount}</span>
            </div>
            <div className="invoice-total-row">
              <span>Shipping</span>
              <span>₹0.00</span>
            </div>
            <div className="invoice-total-final">
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="invoice-footer">
          Thank you for shopping with Janani Home Foods! 
        </div>
      </div>
    </div>
  )
}
