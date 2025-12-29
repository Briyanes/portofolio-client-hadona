/**
 * Test login with production credentials from .env.local
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Testing Production Credentials...\n');
console.log('SUPABASE_URL:', supabaseUrl);
console.log('ANON_KEY:', supabaseAnonKey?.substring(0, 30) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@hadona.id',
    password: 'Admin@12345',
  });

  if (error) {
    console.error('❌ Login FAILED:', error.message);
    console.error('\nThis means:');
    console.error('1. Environment variables di Vercel BELUM diset dengan benar');
    console.error('2. Atau password di Supabase production beda dengan local\n');
    console.log('💡 SOLUSI:');
    console.log('1. Buka Vercel Dashboard → Settings → Environment Variables');
    console.log('2. Pastikan KE-4 variables ini ada dengan VALUE yang PERSIS SAMA:');
    console.log('   - NEXT_PUBLIC_SUPABASE_URL');
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.log('   - SUPABASE_SERVICE_ROLE_KEY');
    console.log('   - NEXT_PUBLIC_APP_URL');
    console.log('3. Klik Redeploy di Vercel\n');
  } else {
    console.log('✅ Login SUCCESS!');
    console.log('User ID:', data.user.id);
    console.log('\nEnvironment variables di Vercel SUDAH benar!');
    console.log('Coba clear cache browser dan login lagi di:\n');
    console.log('https://portofolio.hadona.id/admin/login\n');
  }
}

testLogin();
