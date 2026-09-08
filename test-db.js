const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if(k && v) env[k.trim()] = v.join('=').trim().replace(/^\"|\"$/g, '');
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkOrders() {
  const { data: customers } = await supabase.from('customers').select('id, email, name');
  console.log('Customers:', customers);

  const { data: orders } = await supabase.from('orders').select('*');
  console.log('Orders:', orders);
}

checkOrders();
