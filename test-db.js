const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if(k && v) env[k.trim()] = v.join('=').trim().replace(/^\"|\"$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function testFetch() {
  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      *,
      customers (*),
      order_items (*)
    `)
    .limit(1)
    .single()
    
  console.log('Order Error:', JSON.stringify(error, null, 2));
}

testFetch();
