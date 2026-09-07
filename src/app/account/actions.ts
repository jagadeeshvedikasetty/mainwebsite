'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function completeProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Use service role key to bypass RLS when creating the initial profile
  const { createClient: createSupabaseClient } = require('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin.from('customers').insert({
    auth_id: user.id,
    email: user.email,
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
  })

  if (error) {
    console.error('Failed to complete profile:', error)
    redirect('/account?error=Failed to save profile. Please try again.')
  }

  revalidatePath('/account')
  redirect('/account')
}
