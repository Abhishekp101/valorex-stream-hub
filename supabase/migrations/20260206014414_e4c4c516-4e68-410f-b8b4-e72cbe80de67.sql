-- Add normal_print_link column to movies table
ALTER TABLE public.movies ADD COLUMN IF NOT EXISTS normal_print_link text;

-- Create web_series table
CREATE TABLE public.web_series (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  poster_url TEXT,
  release_date TEXT,
  category TEXT DEFAULT 'hollywood',
  language TEXT DEFAULT 'english',
  info TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seasons table
CREATE TABLE public.seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id UUID NOT NULL REFERENCES public.web_series(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(series_id, season_number)
);

-- Create episodes table
CREATE TABLE public.episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  video_link TEXT,
  download_link TEXT,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(season_id, episode_number)
);

-- Enable RLS
ALTER TABLE public.web_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for web_series
CREATE POLICY "Web series are publicly readable" ON public.web_series FOR SELECT USING (true);
CREATE POLICY "Admins can insert web series" ON public.web_series FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update web series" ON public.web_series FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete web series" ON public.web_series FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for seasons
CREATE POLICY "Seasons are publicly readable" ON public.seasons FOR SELECT USING (true);
CREATE POLICY "Admins can insert seasons" ON public.seasons FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update seasons" ON public.seasons FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete seasons" ON public.seasons FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for episodes
CREATE POLICY "Episodes are publicly readable" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Admins can insert episodes" ON public.episodes FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update episodes" ON public.episodes FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete episodes" ON public.episodes FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at on web_series
CREATE TRIGGER update_web_series_updated_at
BEFORE UPDATE ON public.web_series
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();