-- ===========================================
-- CHECK & INSERT SAMPLE DATA (SAFE VERSION)
-- Jalankan di Supabase SQL Editor
-- ===========================================

-- Cek apakah data sudah ada
SELECT COUNT(*) as existing_count FROM case_studies;

-- Jika count = 0, baru insert sample data
-- Jika count > 0, berarti data sudah ada, skip insert

-- Hapus dulu jika perlu (UNCOMMENT baris di bawah untuk delete semua data lama)
-- DELETE FROM case_studies WHERE slug IN ('meningkatkan-roas-ecommerce-fashion', 'pelatihan-digital-marketing-bank-bumn', 'growth-hacking-startup-fintech');

-- Insert dengan ON CONFLICT untuk handle duplicate
INSERT INTO case_studies (
  title, slug, client_name, client_logo_url, category_id,
  challenge, strategy, results,
  testimonial, testimonial_author, testimonial_position,
  thumbnail_url, hero_image_url, gallery_urls, metrics,
  meta_title, meta_description, meta_keywords,
  is_featured, is_published, display_order
)
VALUES
-- Case Study 1: Digital Advertising
(
  'Meningkatkan ROAS hingga 8-9x untuk E-Commerce Fashion',
  'meningkatkan-roas-ecommerce-fashion',
  'Fashion Style Indonesia',
  'https://via.placeholder.com/500x500/2B46BB/FFFFFF?text=FSI',
  (SELECT id FROM categories WHERE slug = 'digital-advertising'),
  'Klien kami, sebuah brand fashion lokal, mengalami kesulitan dalam meningkatkan penjualan online. Biaya iklan tinggi namun konversi rendah, sehingga ROAS hanya mencapai 2-3x.',
  'Kami melakukan audit mendalam terhadap kampanye iklan yang ada dan melakukan restrukturisasi target audiens. Kami mengimplementasikan strategi: Segmentasi audiens, creative assets yang lebih engaging, optimalisasi bidding strategy, dan A/B testing.',
  'Dalam 3 bulan, kami berhasil meningkatkan ROAS dari 2-3x menjadi 8-9x, menurunkan cost per acquisition sebesar 60%, dan meningkatkan revenue bulanan sebesar 300%.',
  'Kolaborasi dengan Hadona Digital Media adalah keputusan terbaik yang kami buat. Mereka benar-benar memahami target market kami.',
  'Sarah Wijaya',
  'CEO Fashion Style Indonesia',
  'https://via.placeholder.com/1200x630/2B46BB/FFFFFF?text=Case+Study+1',
  'https://via.placeholder.com/1920x1080/2B46BB/FFFFFF?text=Hero+Fashion',
  ARRAY['https://via.placeholder.com/1920x1080/1E3190/FFFFFF?text=G1', 'https://via.placeholder.com/1920x1080/4A6AE8/FFFFFF?text=G2'],
  '{"ROAS": "8-9x", "Revenue": "+300%"}'::jsonb,
  'Studi Kasus ROAS 8-9x E-Commerce Fashion',
  'Pelajari bagaimana kami meningkatkan ROAS hingga 8-9x untuk brand fashion lokal dalam waktu 3 bulan.',
  ARRAY['ROAS', 'E-commerce', 'Digital Advertising'],
  true, true, 1
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  category_id = EXCLUDED.category_id,
  challenge = EXCLUDED.challenge,
  strategy = EXCLUDED.strategy,
  results = EXCLUDED.results,
  is_published = EXCLUDED.is_published;

-- Case Study 2: Corporate Training
INSERT INTO case_studies (
  title, slug, client_name, client_logo_url, category_id,
  challenge, strategy, results,
  testimonial, testimonial_author, testimonial_position,
  thumbnail_url, hero_image_url, gallery_urls, metrics,
  meta_title, meta_description, meta_keywords,
  is_featured, is_published, display_order
)
VALUES (
  'Program Pelatihan Digital Marketing untuk 500 Karyawan Bank BUMN',
  'pelatihan-digital-marketing-bank-bumn',
  'Bank Nasional Indonesia',
  'https://via.placeholder.com/500x500/EDD947/333333?text=BNI',
  (SELECT id FROM categories WHERE slug = 'corporate-training'),
  'Sebuah bank BUMN terkemuka ingin meningkatkan literasi digital marketing di kalangan 500 karyawan dengan berbagai level jabatan.',
  'Kami merancang program pelatihan comprehensive dengan kurikulum berbasis level, metode hybrid learning, dan project-based learning.',
  '500 karyawan berhasil dilatih dalam 6 bulan dengan 95% pass rate dan satisfaction score 4.7/5.0.',
  'Program pelatihan dari Hadona sangat praktis dan langsung bisa diterapkan di pekerjaan sehari-hari.',
  'Budi Santoso',
  'Head of Learning & Development',
  'https://via.placeholder.com/1200x630/EDD947/333333?text=Case+Study+2',
  'https://via.placeholder.com/1920x1080/EDD947/333333?text=Hero+Bank',
  ARRAY['https://via.placeholder.com/1920x1080/E5D03D/333333?text=T1'],
  '{"Participants": "500", "Pass Rate": "95%"}'::jsonb,
  'Studi Kasus Corporate Training Bank BUMN',
  'Program pelatihan digital marketing untuk 500 karyawan bank BUMN.',
  ARRAY['Corporate Training', 'Digital Marketing', 'Bank'],
  true, true, 2
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  is_published = EXCLUDED.is_published;

-- Case Study 3: Growth Hacking
INSERT INTO case_studies (
  title, slug, client_name, client_logo_url, category_id,
  challenge, strategy, results,
  testimonial, testimonial_author, testimonial_position,
  thumbnail_url, hero_image_url, gallery_urls, metrics,
  meta_title, meta_description, meta_keywords,
  is_featured, is_published, display_order
)
VALUES (
  'Dari 0 ke 30.000 Followers dalam 6 Bulan - Startup Fintech',
  'growth-hacking-startup-fintech',
  'PayQuik Indonesia',
  'https://via.placeholder.com/500x500/4A6AE8/FFFFFF?text=PQ',
  (SELECT id FROM categories WHERE slug = 'growth-hacking'),
  'Sebuah startup fintech baru launching dengan budget marketing terbatas dan perlu membangun user base dari nol.',
  'Kami mengimplementasikan strategi growth hacking: viral referral program, content marketing, community building, dan strategic partnership.',
  'Dalam 6 bulan kami berhasil membangun 30.000+ organic followers dan 50.000+ app downloads dengan cost Rp 2.500/user.',
  'Hadona tidak hanya sebagai agency, tapi sebagai true growth partner.',
  'Andi Pratama',
  'Co-founder & CEO',
  'https://via.placeholder.com/1200x630/4A6AE8/FFFFFF?text=Case+Study+3',
  'https://via.placeholder.com/1920x1080/4A6AE8/FFFFFF?text=Hero+Fintech',
  ARRAY['https://via.placeholder.com/1920x1080/1E3190/FFFFFF?text=GH1'],
  '{"Followers": "30K+", "Downloads": "50K+"}'::jsonb,
  'Studi Kasus Growth Hacking Startup Fintech',
  'Bagaimana kami membangun 30.000 followers untuk startup fintech dalam 6 bulan.',
  ARRAY['Growth Hacking', 'Startup', 'Fintech'],
  false, true, 3
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  client_name = EXCLUDED.client_name,
  is_published = EXCLUDED.is_published;

-- Verify data
SELECT title, client_name, is_published, slug FROM case_studies ORDER BY display_order;
