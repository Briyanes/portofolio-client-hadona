/**
 * Script to create the first admin user
 * Run with: npx ts-node scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser(email: string, password: string) {
  try {
    console.log(`\n🔐 Creating admin user: ${email}`);

    // 1. Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      // User might already exist, try to get them
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existingUser = users.find(u => u.email === email);

      if (!existingUser) {
        throw authError;
      }

      console.log(`✅ User already exists: ${existingUser.id}`);

      // 2. Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .upsert({
          id: existingUser.id,
          email: existingUser.email!,
          is_active: true,
        }, {
          onConflict: 'id'
        });

      if (adminError) {
        console.error('❌ Error adding user to admin_users:', adminError);
        process.exit(1);
      }

      console.log('✅ User added to admin_users table');
    } else {
      console.log(`✅ Auth user created: ${authData.user.id}`);

      // 2. Add to admin_users table
      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          is_active: true,
        });

      if (adminError) {
        console.error('❌ Error adding user to admin_users:', adminError);
        process.exit(1);
      }

      console.log('✅ User added to admin_users table');
    }

    console.log('\n✨ Admin user setup complete!');
    console.log('\n📝 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Admin URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  Please save these credentials and change the password after first login.\n');

  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Get credentials from command line or use defaults
const args = process.argv.slice(2);
const email = args[0] || 'admin@hadona.id';
const password = args[1] || 'Admin@123456';

createAdminUser(email, password);
