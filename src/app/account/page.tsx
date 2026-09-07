import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '../login/actions'

import { completeProfile } from './actions'

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
      <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-orange-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2 text-sm">Your account exists, but we need a few more details to set up your customer dashboard.</p>
          </div>
          
          <form action={completeProfile} className="space-y-4 pt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" id="name" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" id="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="e.g. +91 9876543210" />
            </div>
            
            {searchParams?.error && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm text-center">
                {searchParams.error}
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
              Save Profile
            </button>
          </form>
          
          <div className="pt-6 border-t border-gray-100 mt-6 text-center">
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-500 hover:text-gray-900 underline">Sign Out instead</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const orders = customer.orders || []
  // Sort orders by newest first
  orders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const activeOrders = orders.filter((o: any) => ['pending', 'processing'].includes(o.status?.toLowerCase()))
  const pastOrders = orders.filter((o: any) => ['completed', 'cancelled'].includes(o.status?.toLowerCase()))

  const OrderCard = ({ order }: { order: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm">
      <div>
        <p className="text-sm text-gray-500">Order #{order.id.split('-')[0]}</p>
        <p className="font-semibold text-gray-900 mt-1">₹{order.total_amount}</p>
        <p className="text-xs text-gray-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
      </div>
      <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end space-y-2">
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize 
          ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'}`}>
          {order.status || 'Pending'}
        </span>
        <Link href={`/account/orders/${order.id}`} className="text-sm text-orange-600 hover:text-orange-700 font-medium underline">
          View Invoice
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {customer.name}</h1>
            <p className="text-gray-600 mt-1">{customer.email} • {customer.phone}</p>
          </div>
          <form action={logout} className="mt-4 sm:mt-0">
            <button type="submit" className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Active Orders */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Active Orders</h2>
              {activeOrders.length > 0 ? (
                activeOrders.map((order: any) => <OrderCard key={order.id} order={order} />)
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">You have no active orders.</p>
                  <Link href="/shop" className="mt-2 inline-block text-orange-600 font-medium hover:underline">Start Shopping</Link>
                </div>
              )}
            </section>

            {/* Past Orders */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Past Orders</h2>
              {pastOrders.length > 0 ? (
                pastOrders.map((order: any) => <OrderCard key={order.id} order={order} />)
              ) : (
                <p className="text-gray-500 italic">No past orders yet.</p>
              )}
            </section>
          </div>

          {/* Sidebar / Profile Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <p className="font-medium text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                  <p className="font-medium text-gray-900">{customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
