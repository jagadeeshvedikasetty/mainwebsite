'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function placeOrder(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Please log in to place an order' }
  }

  // 2. Fetch their customer record to get customer_id
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('auth_id', user.id)
    .single()

  if (!customer) {
    return { success: false, message: 'Please complete your profile first. Go to your Account Dashboard.' }
  }

  // 3. Extract form data
  const shippingAddress = formData.get('address') as string
  const cartDataStr = formData.get('cartData') as string
  if (!cartDataStr) {
    return { success: false, message: 'Your cart is empty' }
  }

  const items = JSON.parse(cartDataStr)
  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

  // 4. Create the Order
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      customer_id: customer.id,
      total_amount: totalAmount,
      status: 'Pending',
      payment_method: 'Cash on Delivery',
      shipping_address: shippingAddress
    })
    .select()
    .single()

  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { success: false, message: 'Failed to place order. Please try again.' }
  }

  // 5. Create Order Items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    return { success: false, message: 'Order created but failed to save items.' }
  }

  return { success: true, message: 'Order placed successfully!' }
}
