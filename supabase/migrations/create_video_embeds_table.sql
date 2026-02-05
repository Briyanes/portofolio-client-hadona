-- Create video_embeds table for standalone featured videos (Instagram Reels/TikTok)
CREATE TABLE IF NOT EXISTS public.video_embeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube')),
  client_name TEXT,
  description TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS video_embeds_is_active_idx ON public.video_embeds(is_active);
CREATE INDEX IF NOT EXISTS video_embeds_is_featured_idx ON public.video_embeds(is_featured);
CREATE INDEX IF NOT EXISTS video_embeds_display_order_idx ON public.video_embeds(display_order);
CREATE INDEX IF NOT EXISTS video_embeds_platform_idx ON public.video_embeds(platform);

-- Enable RLS
ALTER TABLE public.video_embeds ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (active videos only)
CREATE POLICY "Anyone can view active video embeds"
ON public.video_embeds FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Create policy for admin management
CREATE POLICY "Admin users can manage video embeds"
ON public.video_embeds FOR ALL
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
CREATE OR REPLACE FUNCTION update_video_embeds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER video_embeds_updated_at
BEFORE UPDATE ON public.video_embeds
FOR EACH ROW
EXECUTE FUNCTION update_video_embeds_updated_at();

-- =====================================================
-- Add video_embeds column to case_studies table
-- This allows each case study to have multiple embedded videos
-- =====================================================

ALTER TABLE public.case_studies 
ADD COLUMN IF NOT EXISTS video_embeds JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN public.case_studies.video_embeds IS 'Array of video embed objects: [{url: string, platform: "instagram"|"tiktok"|"youtube", title?: string}]';
