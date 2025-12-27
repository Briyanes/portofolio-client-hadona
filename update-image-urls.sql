-- Update sample data with local placeholder images
-- Run this in Supabase SQL Editor

-- Update Case Study 1 - FSI
UPDATE case_studies SET
  client_logo_url = '/placeholders/client-logo-fsi.svg',
  thumbnail_url = '/placeholders/thumbnail-cs1.svg',
  hero_image_url = '/placeholders/hero-cs1.svg',
  gallery_urls = ARRAY[
    '/placeholders/gallery1-cs1.svg',
    '/placeholders/gallery2-cs1.svg',
    '/placeholders/gallery3-cs1.svg'
  ]
WHERE slug = 'fashion-style-Indonesia';

-- Update Case Study 2 - BNI
UPDATE case_studies SET
  client_logo_url = '/placeholders/client-logo-bni.svg',
  thumbnail_url = '/placeholders/thumbnail-cs2.svg',
  hero_image_url = '/placeholders/hero-cs2.svg',
  gallery_urls = ARRAY[
    '/placeholders/gallery1-cs2.svg',
    '/placeholders/gallery2-cs2.svg'
  ]
WHERE slug = 'bank-national-training';

-- Update Case Study 3 - PQ
UPDATE case_studies SET
  client_logo_url = '/placeholders/client-logo-pq.svg',
  thumbnail_url = '/placeholders/thumbnail-cs3.svg',
  hero_image_url = '/placeholders/hero-cs3.svg',
  gallery_urls = ARRAY[
    '/placeholders/gallery1-cs3.svg',
    '/placeholders/gallery2-cs3.svg',
    '/placeholders/gallery3-cs3.svg'
  ]
WHERE slug = 'payment-quick-growth';
