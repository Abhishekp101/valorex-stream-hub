-- Add is_featured column to movies table for slider management
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create index for faster featured movie queries
CREATE INDEX IF NOT EXISTS idx_movies_is_featured ON public.movies(is_featured) WHERE is_featured = true;