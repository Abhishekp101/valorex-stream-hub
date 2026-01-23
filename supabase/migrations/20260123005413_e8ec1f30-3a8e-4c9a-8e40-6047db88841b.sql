-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Create movies table
CREATE TABLE public.movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    release_date TEXT,
    info TEXT,
    poster_url TEXT,
    download_link TEXT,
    category TEXT DEFAULT 'hollywood',
    language TEXT DEFAULT 'english',
    quality TEXT DEFAULT '1080p',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on movies
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;

-- Movies are publicly readable
CREATE POLICY "Movies are publicly readable"
ON public.movies FOR SELECT
USING (true);

-- Only admins can insert movies
CREATE POLICY "Admins can insert movies"
ON public.movies FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update movies
CREATE POLICY "Admins can update movies"
ON public.movies FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete movies
CREATE POLICY "Admins can delete movies"
ON public.movies FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    movie_name TEXT NOT NULL,
    article TEXT,
    poster_url TEXT,
    download_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog posts are publicly readable
CREATE POLICY "Blog posts are publicly readable"
ON public.blog_posts FOR SELECT
USING (true);

-- Only admins can insert blog posts
CREATE POLICY "Admins can insert blog posts"
ON public.blog_posts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update blog posts
CREATE POLICY "Admins can update blog posts"
ON public.blog_posts FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete blog posts
CREATE POLICY "Admins can delete blog posts"
ON public.blog_posts FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create enum for software/game platform
CREATE TYPE public.platform_type AS ENUM ('windows', 'mac', 'android_apps', 'android_games', 'pc_games');

-- Create software_games table
CREATE TABLE public.software_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    version TEXT,
    platform platform_type NOT NULL DEFAULT 'windows',
    category TEXT,
    icon_url TEXT,
    download_count INTEGER DEFAULT 0,
    file_size TEXT,
    reputation INTEGER DEFAULT 4 CHECK (reputation >= 1 AND reputation <= 5),
    download_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on software_games
ALTER TABLE public.software_games ENABLE ROW LEVEL SECURITY;

-- Software/games are publicly readable
CREATE POLICY "Software games are publicly readable"
ON public.software_games FOR SELECT
USING (true);

-- Only admins can insert software/games
CREATE POLICY "Admins can insert software games"
ON public.software_games FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update software/games
CREATE POLICY "Admins can update software games"
ON public.software_games FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete software/games
CREATE POLICY "Admins can delete software games"
ON public.software_games FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_movies_updated_at
BEFORE UPDATE ON public.movies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_software_games_updated_at
BEFORE UPDATE ON public.software_games
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();