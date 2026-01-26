-- Add video_link column to movies table for Google Drive video links
ALTER TABLE public.movies ADD COLUMN video_link text DEFAULT NULL;