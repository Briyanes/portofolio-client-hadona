-- Add GTM container ID column to pixel_settings table
ALTER TABLE pixel_settings
ADD COLUMN IF NOT EXISTS gtm_id TEXT,
ADD COLUMN IF NOT EXISTS is_gtm_enabled BOOLEAN DEFAULT false;

-- Update existing row
UPDATE pixel_settings
SET gtm_id = NULL,
    is_gtm_enabled = false
WHERE id = '1';
