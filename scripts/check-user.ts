/**
 * Script to check user and test login
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function checkAndTestLogin(email: string, password: string) {
  try {
    console.log(`\n🔍 Checking user: ${email}`);
    console.log(`🔑 Password: ${password}\n`);

    // 1. List all users with service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey!);
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      return;
    }

    console.log(`📊 Total users in auth: ${users.length}\n`);

    // Find our user
    const user = users.find(u => u.email === email);

    if (!user) {
      console.error(`❌ User NOT found in auth.users: ${email}`);
      console.log('Available users:');
      users.forEach(u => console.log(`  - ${u.email}`));
      return;
    }

    console.log(`✅ User found in auth.users:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Email confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
    console.log(`   Created at: ${user.created_at}`);
    console.log(`   Last sign in: ${user.last_sign_in_at || 'Never'}\n`);

    // 2. Check admin_users table
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (adminError || !adminUser) {
      console.error(`❌ User NOT found in admin_users table`);
      console.log(`   Error: ${adminError?.message || 'Not found'}`);
    } else {
      console.log(`✅ User found in admin_users:`);
      console.log(`   ID: ${adminUser.id}`);
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Is Active: ${adminUser.is_active}`);
      console.log(`   Last Login: ${adminUser.last_login || 'Never'}\n`);
    }

    // 3. Test login with anon key (like the app does)
    console.log(`🔐 Testing login with anon key...`);
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error(`❌ Login FAILED with anon key:`);
      console.error(`   Error: ${authError.message}`);
      console.error(`   Status: ${authError.status}`);
      console.error(`   Name: ${authError.name}\n`);

      console.log(`💡 Try creating a NEW admin user:`);
      console.log(`   npx ts-node scripts/create-admin.ts NEW@admin.id NEW@Password123`);
    } else {
      console.log(`✅ Login SUCCESS with anon key!`);
      console.log(`   User ID: ${authData.user.id}`);
      console.log(`   Access token: ${authData.session.access_token.substring(0, 20)}...\n`);

      console.log(`🎉 Credentials are correct! You should be able to login now.\n`);
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

const args = process.argv.slice(2);
const email = args[0] || 'admin@hadona.id';
const password = args[1] || 'Admin@12345';

checkAndTestLogin(email, password);
