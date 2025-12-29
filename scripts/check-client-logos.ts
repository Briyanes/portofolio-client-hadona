/**
 * Script to check client logos data in database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkClientLogos() {
  console.log('🔍 Checking client logos in database...\n');

  const { data, error } = await supabase
    .from('client_logos')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total client logos: ${data?.length || 0}\n`);

  if (data && data.length > 0) {
    console.log('Client Logos data:');
    data.forEach((logo, i) => {
      console.log(`\n${i + 1}. ${logo.name}`);
      console.log(`   Active: ${logo.is_active}`);
      console.log(`   Logo URL: ${logo.logo_url || 'NULL'}`);
      console.log(`   Website: ${logo.website_url || 'N/A'}`);
      console.log(`   Display Order: ${logo.display_order}`);

      if (!logo.logo_url) {
        console.log(`   ⚠️  WARNING: No logo URL!`);
      }
    });
  } else {
    console.log('❌ No client logos found in database');
  }
}

checkClientLogos().catch(console.error);
