import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Film, Maximize2, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Movie {
  id: string;
  title: string;
  poster_url: string | null;
  video_link: string | null;
  category: string | null;
}

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setLoading(true);
      
      const { data: movieData, error } = await supabase
        .from('movies')
        .select('id, title, poster_url, video_link, category')
        .eq('id', id)
        .maybeSingle();

      if (!error && movieData) {
        setMovie(movieData);
        
        // Convert Google Drive link to embed format
        if (movieData.video_link) {
          const embedLink = convertToEmbedUrl(movieData.video_link);
          setEmbedUrl(embedLink);
        }
      }
      
      setLoading(false);
    };

    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  // Convert Google Drive link to embeddable format
  const convertToEmbedUrl = (url: string): string => {
    // Handle different Google Drive URL formats
    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    // Format 2: https://drive.google.com/open?id=FILE_ID
    // Format 3: https://drive.google.com/uc?id=FILE_ID
    
    let fileId = '';
    
    if (url.includes('/file/d/')) {
      const match = url.match(/\/file\/d\/([^\/]+)/);
      if (match) fileId = match[1];
    } else if (url.includes('id=')) {
      const match = url.match(/id=([^&]+)/);
      if (match) fileId = match[1];
    }
    
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    // If it's already an embed URL or unrecognized format, return as-is
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Film className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Movie Not Found</h1>
            <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist or has been removed.</p>
            <Link to="/">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!embedUrl) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Play className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">No Video Available</h1>
            <p className="text-muted-foreground mb-8">This movie doesn't have a streaming link yet.</p>
            <Link to={`/movie/${movie.id}`}>
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Movie Details
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Dark overlay for cinema feel */}
      <div className="fixed inset-0 bg-black/40 -z-10" />
      
      <main className="container py-8">
        {/* Back Button & Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link
            to={`/movie/${movie.id}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Movie
          </Link>
          
          <h1 className="font-display text-xl md:text-2xl font-bold truncate max-w-md">
            {movie.title}
          </h1>
        </motion.div>

        {/* Video Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl shadow-black/50"
        >
          {/* Aspect Ratio Container */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              title={`Watch ${movie.title}`}
            />
          </div>
          
          {/* Gradient overlay at bottom for controls visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </motion.div>

        {/* Movie Info Below Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-6 rounded-xl bg-card border border-border"
        >
          <div className="flex items-start gap-4">
            {movie.poster_url && (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h2 className="font-display text-xl font-bold mb-2">{movie.title}</h2>
              {movie.category && (
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground capitalize">
                  {movie.category}
                </span>
              )}
              <p className="text-muted-foreground text-sm mt-3">
                You are streaming this movie. For the best experience, use a stable internet connection.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Maximize2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Tip: Click the fullscreen button in the player for the best viewing experience</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Watch;
