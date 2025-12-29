/**
 * Script to fix client logo URLs in database
 * Fix empty object {} and ensure all URLs are valid
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

async function fixClientLogoUrls() {
  console.log('🔧 Fixing client logo URLs in database...\n');

  // Get all client logos
  const { data: clientLogos, error } = await supabase
    .from('client_logos')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching client logos:', error);
    return;
  }

  if (!clientLogos || clientLogos.length === 0) {
    console.log('No client logos found');
    return;
  }

  console.log(`Found ${clientLogos.length} client logos\n`);

  for (const logo of clientLogos) {
    const logoUrl = logo.logo_url;

    // Check if logo_url is invalid (empty object, null, or empty string)
    if (!logoUrl || logoUrl === '{}' || typeof logoUrl !== 'string') {
      console.log(`⚠️  Fixing ${logo.name} - Invalid URL: ${logoUrl}`);

      // Set to null so it will show text fallback
      const { error: updateError } = await supabase
        .from('client_logos')
        .update({ logo_url: null })
        .eq('id', logo.id);

      if (updateError) {
        console.error(`   ✗ Failed to update: ${updateError.message}`);
      } else {
        console.log(`   ✓ Updated to null (will show text fallback)`);
      }
    } else {
      console.log(`✓ ${logo.name}: ${logoUrl}`);
    }
  }

  console.log('\n✅ Fix complete!');
}

fixClientLogoUrls().catch(console.error);
