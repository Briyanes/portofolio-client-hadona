import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updateImageUrls() {
  console.log('Updating image URLs to local placeholders...');

  const updates = [
    {
      slug: 'meningkatkan-roas-ecommerce-fashion',
      client_logo_url: '/placeholders/client-logo-fsi.svg',
      thumbnail_url: '/placeholders/thumbnail-cs1.svg',
      hero_image_url: '/placeholders/hero-cs1.svg',
      gallery_urls: [
        '/placeholders/gallery1-cs1.svg',
        '/placeholders/gallery2-cs1.svg',
        '/placeholders/gallery3-cs1.svg'
      ]
    },
    {
      slug: 'pelatihan-digital-marketing-bank-bumn',
      client_logo_url: '/placeholders/client-logo-bni.svg',
      thumbnail_url: '/placeholders/thumbnail-cs2.svg',
      hero_image_url: '/placeholders/hero-cs2.svg',
      gallery_urls: [
        '/placeholders/gallery1-cs2.svg',
        '/placeholders/gallery2-cs2.svg'
      ]
    },
    {
      slug: 'growth-hacking-startup-fintech',
      client_logo_url: '/placeholders/client-logo-pq.svg',
      thumbnail_url: '/placeholders/thumbnail-cs3.svg',
      hero_image_url: '/placeholders/hero-cs3.svg',
      gallery_urls: [
        '/placeholders/gallery1-cs3.svg',
        '/placeholders/gallery2-cs3.svg',
        '/placeholders/gallery3-cs3.svg'
      ]
    }
  ];

  for (const update of updates) {
    console.log(`Updating ${update.slug}...`);
    const { error } = await supabaseAdmin
      .from('case_studies')
      .update({
        client_logo_url: update.client_logo_url,
        thumbnail_url: update.thumbnail_url,
        hero_image_url: update.hero_image_url,
        gallery_urls: update.gallery_urls
      })
      .eq('slug', update.slug);

    if (error) {
      console.error(`Error updating ${update.slug}:`, error);
    } else {
      console.log(`✓ Updated ${update.slug}`);
    }
  }

  console.log('Done!');
  process.exit(0);
}

updateImageUrls().catch(console.error);
