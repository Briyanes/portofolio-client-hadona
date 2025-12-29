/**
 * Script to populate testimonials and client logos from existing data
 * Run with: npx ts-node --esm scripts/populate-testimonials-logos.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

async function populateTestimonialsFromCaseStudies() {
  console.log('📝 Populating testimonials from existing case studies...');

  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('id, client_name, testimonial, testimonial_author, testimonial_position, display_order')
    .eq('is_published', true)
    .not('testimonial', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching case studies:', error);
    return;
  }

  if (!caseStudies || caseStudies.length === 0) {
    console.log('No testimonials found in case studies');
    return;
  }

  console.log(`Found ${caseStudies.length} testimonials to import`);

  for (const cs of caseStudies) {
    // Check if testimonial already exists
    const { data: existing } = await supabase
      .from('testimonials')
      .select('id')
      .eq('client_name', cs.client_name)
      .eq('testimonial', cs.testimonial)
      .single();

    if (existing) {
      console.log(`  ✓ Skipping duplicate: ${cs.client_name}`);
      continue;
    }

    const { error: insertError } = await supabase
      .from('testimonials')
      .insert({
        client_name: cs.client_name,
        testimonial: cs.testimonial || '',
        position: cs.testimonial_position || null,
        is_featured: true,
        is_published: true,
        display_order: cs.display_order || 0,
        case_study_id: cs.id,
      });

    if (insertError) {
      console.error(`  ✗ Failed to import ${cs.client_name}:`, insertError.message);
    } else {
      console.log(`  ✓ Imported: ${cs.client_name}`);
    }
  }

  console.log('✅ Testimonials population complete\n');
}

async function populateClientLogosFromCaseStudies() {
  console.log('🖼️  Populating client logos from existing case studies...');

  const { data: caseStudies, error } = await supabase
    .from('case_studies')
    .select('id, client_name, client_logo_url, display_order')
    .eq('is_published', true)
    .not('client_logo_url', 'is', null)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching case studies:', error);
    return;
  }

  if (!caseStudies || caseStudies.length === 0) {
    console.log('No client logos found in case studies');
    return;
  }

  console.log(`Found ${caseStudies.length} client logos to import`);

  for (const cs of caseStudies) {
    // Check if logo already exists
    const { data: existing } = await supabase
      .from('client_logos')
      .select('id')
      .eq('name', cs.client_name)
      .single();

    if (existing) {
      console.log(`  ✓ Skipping duplicate: ${cs.client_name}`);
      continue;
    }

    const { error: insertError } = await supabase
      .from('client_logos')
      .insert({
        name: cs.client_name,
        logo_url: cs.client_logo_url || '',
        website_url: null,
        is_active: true,
        display_order: cs.display_order || 0,
      });

    if (insertError) {
      console.error(`  ✗ Failed to import ${cs.client_name}:`, insertError.message);
    } else {
      console.log(`  ✓ Imported: ${cs.client_name}`);
    }
  }

  console.log('✅ Client logos population complete\n');
}

async function main() {
  console.log('🚀 Starting data population...\n');

  await populateTestimonialsFromCaseStudies();
  await populateClientLogosFromCaseStudies();

  console.log('✨ All done! Check your admin dashboard for the imported data.');
}

main().catch(console.error);
