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
        status,
        payment_method
      )
    `)
    .eq('auth_id', user.id)
    .single()

  if (error || !customer) {
    // If auth succeeds but no customer record exists, let them complete their profile.
    return (
      <div className="account-container">
        <div className="profile-fallback">
          <h1>Complete Your Profile</h1>
          <p>Your account exists, but we need a few more details to set up your customer dashboard.</p>
          
          <form action={completeProfile}>
            <div className="detail-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" name="name" id="name" required placeholder="e.g. John Doe" />
            </div>
            <div className="detail-group">
              <label htmlFor="phone">Phone Number</label>
              <input type="tel" name="phone" id="phone" required placeholder="e.g. +91 9876543210" />
            </div>
            
            {searchParams?.error && (
              <div className="auth-error" style={{ color: 'red', marginTop: '10px' }}>
                {searchParams.error}
              </div>
            )}

            <button type="submit" className="btn-save">Save Profile</button>
          </form>
          
          <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
            <form action={logout}>
              <button type="submit" style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer' }}>
                Sign Out instead
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const orders = customer.orders || []
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
            <h1>Welcome, {customer.name}</h1>
            <p>{customer.email} • {customer.phone}</p>
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
                <p>{customer.name}</p>
              </div>
              <div className="detail-group">
                <p>Email</p>
                <p>{customer.email}</p>
              </div>
              <div className="detail-group">
                <p>Phone</p>
                <p>{customer.phone}</p>
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
