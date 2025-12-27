-- Migration: Add Quick Info Section Fields
-- Date: 2025-12-27
-- Description: Add website_url, instagram_url, facebook_url, and services fields to case_studies table

-- Add new fields to case_studies table
ALTER TABLE case_studies
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS instagram_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_url TEXT,
ADD COLUMN IF NOT EXISTS services TEXT;

-- Add comments for documentation
COMMENT ON COLUMN case_studies.website_url IS 'Website URL client (optional)';
COMMENT ON COLUMN case_studies.instagram_url IS 'Instagram URL client (optional)';
COMMENT ON COLUMN case_studies.facebook_url IS 'Facebook URL client (optional)';
COMMENT ON COLUMN case_studies.services IS 'Services yang diberikan (dynamic, bukan hardcoded)';

-- Create index for faster queries (optional)
CREATE INDEX IF NOT EXISTS idx_case_studies_website_url ON case_studies(website_url) WHERE website_url IS NOT NULL;
