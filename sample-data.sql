-- ===========================================
-- SAMPLE CASE STUDIES DATA
-- Jalankan di Supabase SQL Editor
-- ===========================================

-- Insert Sample Case Studies
-- Note: Untuk production, ganti URL gambar dengan gambar asli di Supabase Storage

INSERT INTO case_studies (
  title,
  slug,
  client_name,
  client_logo_url,
  category_id,
  challenge,
  strategy,
  results,
  testimonial,
  testimonial_author,
  testimonial_position,
  thumbnail_url,
  hero_image_url,
  gallery_urls,
  metrics,
  meta_title,
  meta_description,
  meta_keywords,
  is_featured,
  is_published,
  display_order
) VALUES
-- Case Study 1: Digital Advertising
(
  'Meningkatkan ROAS hingga 8-9x untuk E-Commerce Fashion',
  'meningkatkan-roas-ecommerce-fashion',
  'Fashion Style Indonesia',
  'https://via.placeholder.com/500x500/2B46BB/FFFFFF?text=FSI',
  (SELECT id FROM categories WHERE slug = 'digital-advertising'),
  'Klien kami, sebuah brand fashion lokal, mengalami kesulitan dalam meningkatkan penjualan online. Biaya iklan tinggi namun konversi rendah, sehingga ROAS hanya mencapai 2-3x. Mereka membutuhkan strategi iklan yang lebih efektif.',
  'Kami melakukan audit mendalam terhadap kampanye iklan yang ada dan melakukan restrukturisasi target audiens. Kami mengimplementasikan strategi:
  1. Segmentasi audiens berdasarkan behavior dan interest
  2. Pembuatan creative assets yang lebih engaging
  3. Optimalisasi bidding strategy
  4. Implementasi dynamic product ads
  5. A/B testing untuk copywriting dan visual',
  'Dalam 3 bulan, kami berhasil:
  - Meningkatkan ROAS dari 2-3x menjadi 8-9x
  - Menurunkan cost per acquisition sebesar 60%
  - Meningkatkan conversion rate sebesar 150%
  - Meningkatkan revenue bulanan sebesar 300%
  - Mencapai 1.5 juta impressions dengan CTR 2.5%',
  'Kolaborasi dengan Hadona Digital Media adalah keputusan terbaik yang kami buat. Mereka benar-benar memahami target market kami dan mampu mengubahkampanye iklan yang kurang efektif menjadi mesin penjualan yang powerful.',
  'Sarah Wijaya',
  'CEO Fashion Style Indonesia',
  'https://via.placeholder.com/1200x630/2B46BB/FFFFFF?text=Case+Study+1',
  'https://via.placeholder.com/1920x1080/2B46BB/FFFFFF?text=Hero+Fashion',
  ARRAY[
    'https://via.placeholder.com/1920x1080/1E3190/FFFFFF?text=Gallery+1',
    'https://via.placeholder.com/1920x1080/4A6AE8/FFFFFF?text=Gallery+2',
    'https://via.placeholder.com/1920x1080/EDD947/333333?text=Gallery+3'
  ],
  '{"ROAS": "8-9x", "Revenue Increase": "300%", "Cost Reduction": "60%", "CTR": "2.5%"}'::jsonb,
  'Studi Kasus ROAS 8-9x E-Commerce Fashion - Hadona Digital Media',
  'Pelajari bagaimana kami meningkatkan ROAS hingga 8-9x untuk brand fashion lokal dalam waktu 3 bulan dengan strategi digital advertising yang terukur.',
  ARRAY['ROAS', 'E-commerce Fashion', 'Digital Advertising', 'Meta Ads', 'Performance Marketing'],
  true,
  true,
  1
),

-- Case Study 2: Corporate Training
(
  'Program Pelatihan Digital Marketing untuk 500 Karyawan Bank BUMN',
  'pelatihan-digital-marketing-bank-bumn',
  'Bank Nasional Indonesia (BNI)',
  'https://via.placeholder.com/500x500/EDD947/333333?text=BNI',
  (SELECT id FROM categories WHERE slug = 'corporate-training'),
  'Sebuah bank BUMN terkemuka ingin meningkatkan literasi digital marketing di kalangan karyawan mereka. Tantangannya adalah menyusun kurikulum pelatihan yang relevan untuk 500 karyawan dengan berbagai level jabatan dan latar belakang teknis yang berbeda.',
  'Kami merancang program pelatihan comprehensive dengan pendekatan:
  1. Pre-training assessment untuk memahami gap skill
  2. Kurikulum berbasis level (basic, intermediate, advanced)
  3. Metode pembelajaran hybrid (online + offline)
  4. Project-based learning dengan real case studies
  5. Post-training evaluation dan certification
  6. Ongoing mentoring session',
  'Hasil yang dicapai:
  - 500 karyawan berhasil dilatih dalam 6 bulan
  - 95% peserta lulus certification exam
  - 89% peserta melaporkan peningkatan produktivitas
  - 150+ digital marketing projects berhasil diimplementasikan
  - Employee satisfaction score: 4.7/5.0',
  'Program pelatihan dari Hadona sangat praktis dan langsung bisa diterapkan di pekerjaan sehari-hari. Mentor-mentornya sangat berpengalaman dan materi yang diberikan selalu update dengan tren terkini.',
  'Budi Santoso',
  'Head of Learning & Development',
  'https://via.placeholder.com/1200x630/EDD947/333333?text=Case+Study+2',
  'https://via.placeholder.com/1920x1080/EDD947/333333?text=Hero+Bank',
  ARRAY[
    'https://via.placeholder.com/1920x1080/E5D03D/333333?text=Training+1',
    'https://via.placeholder.com/1920x1080/2B46BB/FFFFFF?text=Training+2'
  ],
  '{"Participants": "500 Karyawan", "Pass Rate": "95%", "Satisfaction": "4.7/5.0", "Projects": "150+"}'::jsonb,
  'Studi Kasus Corporate Training Bank BUMN - Hadona Digital Media',
  'Program pelatihan digital marketing untuk 500 karyawan bank BUMN dengan tingkat kelulusan 95% dan satisfaction score 4.7/5.0.',
  ARRAY['Corporate Training', 'Digital Marketing', 'Bank BUMN', 'Employee Development', 'Professional Training'],
  true,
  true,
  2
),

-- Case Study 3: Growth Hacking
(
  'Dari 0 ke 30,000 Followers dalam 6 Bulan - Startup Fintech',
  'growth-hacking-startup-fintech',
  'PayQuik Indonesia',
  'https://via.placeholder.com/500x500/4A6AE8/FFFFFF?text=PQ',
  (SELECT id FROM categories WHERE slug = 'growth-hacking'),
  'Sebuah startup fintech baru launching dengan budget marketing terbatas. Tantangan besar: membangun brand awareness dan user base dari nol dalam industri yang sangat kompetitif dengan budget minimal.',
  'Kami mengimplementasikan strategi growth hacking:
  1. Viral referral program dengan incentive structure
  2. Content marketing dengan focus pada financial education
  3. Community building di Telegram dan WhatsApp
  4. Strategic partnership dengan micro-influencers
  5. Product-led growth dengan in-app sharing features
  6. SEO optimization untuk fintech keywords',
  'Dalam 6 bulan kami berhasil:
  - Membangun 30,000+ organic followers
  - Mencapai 50,000+ app downloads
  - User acquisition cost hanya Rp 2.500/user
  - Viral coefficient (k-factor) mencapai 1.2
  - Monthly active users growth: 40% MoM
  - Featured in 10+ tech media',
  'Hadona tidak hanya sebagai agency, tapi sebagai true growth partner. Mereka membantu kami dari zero to hero dengan strategi growth yang sangat kreatif dan efisien.',
  'Andi Pratama',
  'Co-founder & CEO',
  'https://via.placeholder.com/1200x630/4A6AE8/FFFFFF?text=Case+Study+3',
  'https://via.placeholder.com/1920x1080/4A6AE8/FFFFFF?text=Hero+Fintech',
  ARRAY[
    'https://via.placeholder.com/1920x1080/1E3190/FFFFFF?text=Growth+1',
    'https://via.placeholder.com/1920x1080/EDD947/333333?text=Growth+2',
    'https://via.placeholder.com/1920x1080/2B46BB/FFFFFF?text=Growth+3'
  ],
  '{"Followers": "30,000+", "App Downloads": "50,000+", "CAC": "Rp 2.500", "K-Factor": "1.2"}'::jsonb,
  'Studi Kasus Growth Hacking Startup Fintech - Hadona Digital Media',
  'Bagaimana kami membangun 30,000 followers dan 50,000 app downloads untuk startup fintech dalam 6 bulan dengan growth hacking.',
  ARRAY['Growth Hacking', 'Startup Fintech', 'User Acquisition', 'Viral Marketing', 'Community Building'],
  false,
  true,
  3
);

-- Verify inserted data
SELECT
  cs.title,
  cs.client_name,
  cs.is_featured,
  cs.is_published,
  c.name as category_name
FROM case_studies cs
LEFT JOIN categories c ON cs.category_id = c.id
ORDER BY cs.display_order;
