'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
        phone: formData.get('phone') as string,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/register?message=Could not sign up user: ' + error.message)
  }

  // After successful signup, we must create a customer record
  if (authData.user) {
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { error: insertError } = await supabaseAdmin.from('customers').insert({
      auth_id: authData.user.id,
      email: data.email,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    })
    
    if (insertError) {
      console.error('Failed to create customer record during signup:', insertError)
    }
  }

  // If Supabase is configured to require email confirmations (default), 
  // authData.session will be null.
  if (!authData.session) {
    redirect('/register?message=Success! Please check your email inbox to confirm your registration before logging in.')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
