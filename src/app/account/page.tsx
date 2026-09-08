import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'
import { completeProfile } from './actions'
import './account.css'

export default async function AccountDashboard(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch customer details and their orders
  const { data: customer, error } = await supabase
    .from('customers')
    .select(`
      *,
      orders (
        id,
        created_at,
        total_amount,
        status
      )
    `)
    .eq('auth_id', user.id)
    .single()

  let currentCustomer = customer;

  if (error || !customer) {
    // If auth succeeds but no customer record exists, auto-create it securely
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Customer'
    const phone = user.user_metadata?.phone || ''

    // First check if a customer record already exists for this email
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', user.email)
      .single()

    let newCustomer = null
    let dbError = null

    if (existingCustomer) {
      // Update existing record with this auth_id
      const { data, error } = await supabaseAdmin
        .from('customers')
        .update({ auth_id: user.id })
        .eq('id', existingCustomer.id)
        .select()
        .single()
      newCustomer = data
      dbError = error
    } else {
      // Create entirely new record
      const { data, error } = await supabaseAdmin
        .from('customers')
        .insert({
          auth_id: user.id,
          email: user.email,
          name: name,
          phone: phone,
        })
        .select()
        .single()
      newCustomer = data
      dbError = error
    }

    if (dbError || !newCustomer) {
      console.error('Failed to auto-create or link customer profile:', dbError)
      return (
        <div className="account-container text-center py-12">
          <h1 style={{ color: 'red', fontSize: '2rem', marginBottom: '1rem' }}>Account Setup Error</h1>
          <p>We could not link your account profile. Please contact support.</p>
          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', margin: '2rem auto', maxWidth: '500px', borderRadius: '0.5rem', textAlign: 'left', fontFamily: 'monospace' }}>
            <strong>Error Details:</strong> {dbError?.message || JSON.stringify(dbError)}
          </div>
          <form action={logout} className="mt-4">
            <button type="submit" className="account-link">Sign Out</button>
          </form>
        </div>
      )
    }

    currentCustomer = newCustomer
    // Initialize empty orders for a brand new auto-created profile
    currentCustomer.orders = []
  }

  const orders = currentCustomer.orders || []
  orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const activeOrders = orders.filter((o: any) => ['pending', 'processing'].includes(o.status?.toLowerCase()))
  const pastOrders = orders.filter((o: any) => ['completed', 'cancelled'].includes(o.status?.toLowerCase()))

  // Calculate stats
  const totalOrdersCount = orders.length
  const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total_amount), 0)

  const OrderCard = ({ order }: { order: any }) => {
    let statusClass = 'status-pending'
    if (order.status?.toLowerCase() === 'completed') statusClass = 'status-completed'
    if (order.status?.toLowerCase() === 'cancelled') statusClass = 'status-cancelled'

    return (
      <div className="order-card">
        <div className="order-info">
          <p>Order #{order.id.split('-')[0].toUpperCase()}</p>
          <p className="order-price">₹{order.total_amount}</p>
          <p className="order-date">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className="order-actions">
          <span className={`order-status ${statusClass}`}>
            {order.status || 'Pending'}
          </span>
          <Link href={`/account/orders/${order.id}`} className="account-link">
            View Invoice
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="account-container">
      <div className="account-max-width">
        
        {/* Header Section */}
        <div className="account-header">
          <div className="account-header-info">
            <h1>Welcome, {currentCustomer.name}</h1>
            <p>{currentCustomer.email} • {currentCustomer.phone}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="account-logout-btn">
              Sign Out
            </button>
          </form>
        </div>

        <div className="account-grid">
          
          {/* Main Content */}
          <div className="account-main">
            <div className="account-section">
              <h2>Active Orders</h2>
              {activeOrders.length > 0 ? (
                activeOrders.map((order: any) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="account-empty">
                  <p>You have no active orders.</p>
                  <Link href="/shop" className="account-link">Start Shopping</Link>
                </div>
              )}
            </div>

            <div className="account-section" style={{ marginTop: '2rem' }}>
              <h2>Past Orders</h2>
              {pastOrders.length > 0 ? (
                pastOrders.map((order: any) => <OrderCard key={order.id} order={order} />)
              ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No past orders yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar / Profile Info */}
          <div className="account-sidebar">
            <div className="account-details-card">
              <h3>Account Details</h3>
              
              <div className="detail-group">
                <p>Name</p>
                <p>{currentCustomer.name}</p>
              </div>
              <div className="detail-group">
                <p>Email</p>
                <p>{currentCustomer.email}</p>
              </div>
              <div className="detail-group">
                <p>Phone</p>
                <p>{currentCustomer.phone}</p>
              </div>

              <h3 style={{ marginTop: '2rem', marginBottom: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                Your Activity
              </h3>
              <div className="detail-group">
                <p>Total Orders</p>
                <p>{totalOrdersCount}</p>
              </div>
              <div className="detail-group">
                <p>Total Spent</p>
                <p>₹{totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
