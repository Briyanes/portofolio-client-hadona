-- ===========================================
-- COMPLETE RLS POLICIES FIX
-- Jalankan ini di Supabase SQL Editor
-- ===========================================

-- Disable RLS temporarily
ALTER TABLE case_studies DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public read published case studies" ON case_studies;
DROP POLICY IF EXISTS "Admin full access case studies" ON case_studies;
DROP POLICY IF EXISTS "Public read active categories" ON categories;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin read admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin update admin users" ON admin_users;

-- ===========================================
-- CASE STUDIES POLICIES
-- ===========================================

-- Public: Read published case studies
CREATE POLICY "Public read published case studies"
  ON case_studies FOR SELECT
  USING (is_published = true);

-- Admin: Full access to case studies
CREATE POLICY "Admin full access case studies"
  ON case_studies FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- CATEGORIES POLICIES
-- ===========================================

-- Public: Read active categories
CREATE POLICY "Public read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- Admin: Full access to categories
CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- ADMIN USERS POLICIES
-- ===========================================

-- Admin: Read all admin users
CREATE POLICY "Admin read admin users"
  ON admin_users FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Admin: Update admin users
CREATE POLICY "Admin update admin users"
  ON admin_users FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Admin: Insert admin users
CREATE POLICY "Admin insert admin users"
  ON admin_users FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ===========================================
-- STORAGE POLICIES
-- ===========================================

-- Drop existing storage policies
DROP POLICY IF EXISTS "Public read case study images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload case study images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete case study images" ON storage.objects;

-- Public: Read case study images
CREATE POLICY "Public read case study images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'case-study-images');

-- Admin: Upload case study images
CREATE POLICY "Admin upload case study images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'case-study-images' AND
    auth.uid() IS NOT NULL
  );

-- Admin: Delete case study images
CREATE POLICY "Admin delete case study images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'case-study-images' AND
    auth.uid() IS NOT NULL
  );

-- Verify policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
