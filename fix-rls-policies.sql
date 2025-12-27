-- ===========================================
-- FIX RLS POLICIES - Remove infinite recursion
-- ===========================================

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin full access case studies" ON case_studies;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin read admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin update admin users" ON admin_users;

-- Create new policies using auth.uid() directly
-- Case Studies Policies
CREATE POLICY "Admin full access case studies"
  ON case_studies FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Categories Policies
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Admin Users Policies
CREATE POLICY "Admin read admin users"
  ON admin_users FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admin update admin users"
  ON admin_users FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Storage Policies
DROP POLICY IF EXISTS "Admin upload case study images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete case study images" ON storage.objects;

CREATE POLICY "Admin upload case study images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'case-study-images' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin delete case study images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'case-study-images' AND
    auth.uid() IS NOT NULL
  );
