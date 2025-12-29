-- Create client_logos table
CREATE TABLE IF NOT EXISTS public.client_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS client_logos_is_active_idx ON public.client_logos(is_active);
CREATE INDEX IF NOT EXISTS client_logos_display_order_idx ON public.client_logos(display_order);

-- Enable RLS
ALTER TABLE public.client_logos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view active client logos"
ON public.client_logos FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "Admin users can manage client logos"
ON public.client_logos FOR ALL
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
CREATE OR REPLACE FUNCTION update_client_logos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER client_logos_updated_at
BEFORE UPDATE ON public.client_logos
FOR EACH ROW
EXECUTE FUNCTION update_client_logos_updated_at();

-- Add sample client logos (placeholder URLs - replace with actual uploads)
INSERT INTO public.client_logos (name, logo_url, website_url, is_active, display_order) VALUES
('Client 1', 'https://placehold.co/200x200/333/FFF?text=Client+1', 'https://example1.com', true, 1),
('Client 2', 'https://placehold.co/200x200/444/FFF?text=Client+2', 'https://example2.com', true, 2),
('Client 3', 'https://placehold.co/200x200/555/FFF?text=Client+3', 'https://example3.com', true, 3),
('Client 4', 'https://placehold.co/200x200/666/FFF?text=Client+4', 'https://example4.com', true, 4),
('Client 5', 'https://placehold.co/200x200/777/FFF?text=Client+5', 'https://example5.com', true, 5);
