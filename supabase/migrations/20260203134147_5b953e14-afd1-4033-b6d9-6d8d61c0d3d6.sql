-- Create movie requests table
CREATE TABLE public.movie_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_name TEXT NOT NULL,
  language TEXT NOT NULL,
  whatsapp_number TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.movie_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert requests (public feature)
CREATE POLICY "Anyone can submit movie requests"
ON public.movie_requests
FOR INSERT
WITH CHECK (true);

-- Only admins can view all requests
CREATE POLICY "Admins can view all movie requests"
ON public.movie_requests
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update requests
CREATE POLICY "Admins can update movie requests"
ON public.movie_requests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete requests
CREATE POLICY "Admins can delete movie requests"
ON public.movie_requests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_movie_requests_updated_at
BEFORE UPDATE ON public.movie_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();