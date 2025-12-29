-- ========================================
-- Migration: Validate and Fix Client Logo URLs
-- Created: 2025-12-28
-- Description: Check all client_logo_url values and fix invalid paths
-- ========================================

-- Step 1: Identify all case studies with client_logo_url
-- Check which URLs are valid (exist in /public/client/)
CREATE OR REPLACE FUNCTION check_logo_url_exists(url text)
RETURNS boolean AS $$
BEGIN
  -- Check if the URL follows the expected pattern: /client/filename.png
  RETURN url ~ '^/client/[0-9]+_[^/]+\.png$';
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create a report of all logo URLs
SELECT
  id,
  title,
  client_name,
  client_logo_url,
  check_logo_url_exists(client_logo_url) as is_valid_format,
  CASE
    WHEN client_logo_url IS NULL THEN 'MISSING'
    WHEN NOT check_logo_url_exists(client_logo_url) THEN 'INVALID_FORMAT'
    ELSE 'VALID'
  END as url_status
FROM case_studies
WHERE is_published = true
ORDER BY url_status, client_name;

-- Step 3: Find invalid or missing logo URLs
CREATE TEMPORARY TABLE invalid_logo_urls AS
SELECT
  id,
  title,
  client_name,
  client_logo_url,
  CASE
    WHEN client_logo_url IS NULL THEN 'MISSING'
    WHEN client_logo_url = '' THEN 'EMPTY'
    WHEN NOT client_logo_url LIKE '/client/%' THEN 'WRONG_PATH'
    WHEN NOT client_logo_url LIKE '%.png' THEN 'WRONG_EXTENSION'
    ELSE 'OTHER'
  END as issue_type
FROM case_studies
WHERE is_published = true
  AND (
    client_logo_url IS NULL
    OR client_logo_url = ''
    OR NOT check_logo_url_exists(client_logo_url)
  );

-- Step 4: Display issues
SELECT * FROM invalid_logo_urls;

-- Step 5: Add validation constraint for future inserts
-- Note: This will prevent invalid logo URLs from being inserted
ALTER TABLE case_studies
DROP CONSTRAINT IF EXISTS valid_client_logo_url;

ALTER TABLE case_studies
ADD CONSTRAINT valid_client_logo_url
CHECK (
  client_logo_url IS NULL OR
  client_logo_url ~ '^/client/[0-9]+_[^/]+\.png$'
);

-- Step 6: Create audit trigger
CREATE OR REPLACE FUNCTION validate_client_logo_url()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.client_logo_url IS NOT NULL AND NOT check_logo_url_exists(NEW.client_logo_url) THEN
    RAISE WARNING 'Client logo URL format may be invalid: %', NEW.client_logo_url;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_client_logo_url_trigger ON case_studies;

CREATE TRIGGER validate_client_logo_url_trigger
  BEFORE INSERT OR UPDATE OF client_logo_url ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION validate_client_logo_url();

-- Step 7: Clean up (optional - comment out if you want to keep the functions)
-- DROP FUNCTION IF EXISTS check_logo_url_exists(text);
-- DROP TABLE IF EXISTS invalid_logo_urls;

-- ========================================
-- Usage Notes:
-- ========================================
-- 1. Run this migration to add validation
-- 2. Review the output from Step 2 and Step 4
-- 3. Use the Node.js script (scripts/validate-logos.ts) to generate fix statements
-- 4. Apply fixes manually after verification
-- 5. The constraint will prevent future invalid URLs
-- ========================================
