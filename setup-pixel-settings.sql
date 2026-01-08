-- =====================================================
-- PIXEL SETTINGS TABLE SETUP
-- Copy dan jalankan SQL ini di Supabase SQL Editor
-- =====================================================

-- 1. Create pixel_settings table
CREATE TABLE IF NOT EXISTS pixel_settings (
  id TEXT PRIMARY KEY DEFAULT '1',
  meta_pixel_id TEXT,
  ig_pixel_id TEXT,
  gtag_id TEXT,
  is_meta_enabled BOOLEAN DEFAULT false,
  is_ig_enabled BOOLEAN DEFAULT false,
  is_gtag_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE pixel_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow all operations (single-row settings table)
CREATE POLICY "Allow all on pixel_settings" ON pixel_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Insert default settings row
INSERT INTO pixel_settings (id, meta_pixel_id, ig_pixel_id, gtag_id, is_meta_enabled, is_ig_enabled, is_gtag_enabled)
VALUES ('1', NULL, NULL, NULL, false, false, false)
ON CONFLICT (id) DO NOTHING;

-- 5. Verify table created (should show 1 row)
SELECT * FROM pixel_settings;

-- =====================================================
-- SETELAH SELESAI:
-- 1. Buka admin/settings di dashboard
-- 2. Enable Meta Pixel
-- 3. Masukkan Pixel ID
-- 4. Klik Save
-- 5. Refresh halaman untuk konfirmasi tersimpan
-- =====================================================
