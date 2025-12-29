/**
 * Script to check testimonials data in database
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

async function checkTestimonials() {
  console.log('🔍 Checking testimonials in database...\n');

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total testimonials: ${data?.length || 0}\n`);

  if (data && data.length > 0) {
    console.log('Testimonials data:');
    data.forEach((t, i) => {
      console.log(`\n${i + 1}. ${t.client_name}`);
      console.log(`   Published: ${t.is_published}, Featured: ${t.is_featured}`);
      console.log(`   Position: ${t.position || 'N/A'}`);
      console.log(`   Testimoni: ${t.testimonial?.substring(0, 80)}...`);
    });
  } else {
    console.log('❌ No testimonials found in database');
  }
}

checkTestimonials().catch(console.error);
