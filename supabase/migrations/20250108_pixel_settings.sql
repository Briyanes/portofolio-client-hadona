-- Create pixel_settings table
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

-- Enable RLS
ALTER TABLE pixel_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since it's a single-row settings table)
CREATE POLICY "Allow all on pixel_settings" ON pixel_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default settings
INSERT INTO pixel_settings (id, meta_pixel_id, ig_pixel_id, gtag_id, is_meta_enabled, is_ig_enabled, is_gtag_enabled)
VALUES ('1', NULL, NULL, NULL, false, false, false)
ON CONFLICT (id) DO NOTHING;
