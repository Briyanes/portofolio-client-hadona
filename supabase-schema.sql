-- ===========================================
-- HADONA PORTFOLIO - SUPABASE DATABASE SCHEMA
-- ===========================================
-- Run this SQL in Supabase SQL Editor
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLES
-- ===========================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_logo_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Content sections
  challenge TEXT,
  strategy TEXT,
  results TEXT,
  testimonial TEXT,
  testimonial_author TEXT,
  testimonial_position TEXT,

  -- Media
  thumbnail_url TEXT NOT NULL,
  hero_image_url TEXT,
  gallery_urls TEXT[],

  -- Metrics (optional but recommended)
  metrics JSONB,

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],

  -- Status
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES
-- ===========================================

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active, display_order);

-- Case studies indexes
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_category ON case_studies(category_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(is_published, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_case_studies_created ON case_studies(created_at DESC);

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Categories Policies
CREATE POLICY "Public read active categories"
  ON categories FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin full access categories"
  ON categories FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

-- Case Studies Policies
CREATE POLICY "Public read published case studies"
  ON case_studies FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admin full access case studies"
  ON case_studies FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

-- Admin Users Policies
CREATE POLICY "Admin read admin users"
  ON admin_users FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

CREATE POLICY "Admin update admin users"
  ON admin_users FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from name
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(trim(NEW.name), '[^a-zA-Z0-9\s-]', '', 'g'));
    NEW.slug := regexp_replace(NEW.slug, '\s+', '-', 'g');
    NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_category_slug
  BEFORE INSERT ON categories
  FOR EACH ROW
  EXECUTE FUNCTION generate_slug();

-- ===========================================
-- STORAGE BUCKETS
-- ===========================================

-- Create bucket for case study images
INSERT INTO storage.buckets (id, name, public)
VALUES ('case-study-images', 'case-study-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public read case study images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'case-study-images');

CREATE POLICY "Admin upload case study images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'case-study-images' AND
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

CREATE POLICY "Admin delete case study images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'case-study-images' AND
    auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
  );

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, icon, color, display_order, is_active) VALUES
  ('Digital Advertising', 'digital-advertising', 'Kampanye iklan digital yang sukses di berbagai platform', 'bi-megaphone', '#2B46BB', 1, true),
  ('Corporate Training', 'corporate-training', 'Program pelatihan dan pengembangan perusahaan', 'bi-people', '#EDD947', 2, true),
  ('Growth Hack', 'growth-hacking', 'Strategi pertumbuhan bisnis yang inovatif', 'bi-graph-up-arrow', '#4A6AE8', 3, true)
ON CONFLICT (name) DO NOTHING;

-- ===========================================
-- NOTES
-- ===========================================

-- 1. Set up environment variables in .env.local:
--    NEXT_PUBLIC_SUPABASE_URL=your-project-url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
--    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
--
-- 2. Create admin user:
--    - Go to Authentication > Users in Supabase dashboard
--    - Create a new user
--    - Add their UUID to admin_users table:
--      INSERT INTO admin_users (id, email, full_name, role, is_active)
--      VALUES ('user-uuid', 'email@example.com', 'Admin Name', 'admin', true);
--
-- 3. Folder structure in storage:
--    - case-study-images/thumbnails/
--    - case-study-images/heroes/
--    - case-study-images/gallery/
--    - case-study-images/client-logos/
--
-- 4. Recommended next steps:
--    - Set up authentication in Supabase dashboard
--    - Configure email templates
--    - Set up custom domain (optional)
-- ===========================================
