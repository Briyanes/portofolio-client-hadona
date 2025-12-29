-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  testimonial TEXT NOT NULL,
  position TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS testimonials_is_published_idx ON public.testimonials(is_published);
CREATE INDEX IF NOT EXISTS testimonials_display_order_idx ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS testimonials_case_study_id_idx ON public.testimonials(case_study_id);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view published testimonials"
ON public.testimonials FOR SELECT
TO authenticated
USING (is_published = true);

CREATE POLICY "Admin users can manage testimonials"
ON public.testimonials FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
    AND admin_users.is_active = true
  )
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION update_testimonials_updated_at();

-- Add some sample testimonials
INSERT INTO public.testimonials (client_name, testimonial, position, is_featured, is_published, display_order) VALUES
(
  'PT Fashion Indonesia',
  'Hadona Digital Media membantu kami meningkatkan ROAS hingga 8.5x dalam 3 bulan. Strategi paid ads yang mereka implementasikan sangat efektif dan berbasis data.',
  'Marketing Director',
  true,
  true,
  1
),
(
  'Restaurant Chain XYZ',
  'Kerjasama dengan Hadona untuk campaign TikTok berhasil mendapatkan 15 juta views dalam 30 hari. Brand awareness kami meningkat drastis!',
  'Brand Manager',
  true,
  true,
  2
),
(
  'Tech Startup ABC',
  'SEO transformation yang luar biasa! DA kami naik dari 25 ke 65, dan organic traffic meningkat 850%. Tim Hadona sangat profesional dan hasil-oriented.',
  'CEO & Founder',
  true,
  true,
  3
);
