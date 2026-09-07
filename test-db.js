import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.from('customers').insert({
    auth_id: '00000000-0000-0000-0000-000000000000',
    email: 'test@example.com',
    name: 'Test',
    phone: '123'
  });
  console.log('Error:', error);
}

test();
