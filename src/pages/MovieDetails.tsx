import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Film, Star, Clock, Globe, Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ShareButtons from '@/components/ShareButtons';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Movie {
  id: string;
  title: string;
  release_date: string | null;
  info: string | null;
  poster_url: string | null;
  download_link: string | null;
  video_link: string | null;
  category: string | null;
  language: string | null;
  quality: string | null;
  created_at: string;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      setLoading(true);
      
      const { data: movieData, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && movieData) {
        setMovie(movieData);
        
        // Fetch related movies (same category, excluding current)
        const { data: relatedData } = await supabase
          .from('movies')
          .select('*')
          .eq('category', movieData.category)
          .neq('id', id)
          .limit(5);
        
        if (relatedData) {
          setRelatedMovies(relatedData);
        }
      }
      
      setLoading(false);
    };

    fetchMovie();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="grid lg:grid-cols-[350px_1fr] gap-10">
            <Skeleton className="aspect-[2/3] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-14 w-48" />
            </div>
          </div>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Background */}
      <div className="absolute inset-x-0 top-16 h-80 overflow-hidden -z-10">
        {movie.poster_url && (
          <>
            <img
              src={movie.poster_url}
              alt=""
              className="w-full h-full object-cover blur-3xl opacity-30 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
          </>
        )}
      </div>
      
      <main className="container py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Movies
          </Link>
        </motion.div>

        {/* Movie Details */}
        <div className="grid lg:grid-cols-[350px_1fr] gap-10 mb-16">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-border shadow-valorex-hover">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <Film className="w-20 h-20 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Floating Quality Badge */}
            {movie.quality && (
              <div className="absolute -top-3 -right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30">
                {movie.quality}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {movie.title}
              </h1>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {movie.category && (
                  <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                    {movie.category}
                  </Badge>
                )}
                {movie.language && (
                  <Badge variant="outline" className="capitalize text-sm px-3 py-1 gap-1">
                    <Globe className="w-3 h-3" />
                    {movie.language}
                  </Badge>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                {movie.release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.release_date}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>2h 30m</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} />
                  ))}
                  <span className="ml-1">4.5</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {movie.info && (
              <div className="p-6 rounded-xl bg-card border border-border">
                <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Synopsis
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {movie.info}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {movie.download_link && (
                <a
                  href={movie.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-3 text-lg h-14 px-8 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">
                    <Download className="w-5 h-5" />
                    Download Now
                  </Button>
                </a>
              )}
              
              {movie.video_link && (
                <Link to={`/watch/${movie.id}`}>
                  <Button size="lg" variant="outline" className="gap-3 text-lg h-14 px-8 border-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all">
                    <Play className="w-5 h-5" />
                    Play Online
                  </Button>
                </Link>
              )}
            </div>

            {/* Share Buttons */}
            <div className="pt-6 border-t border-border">
              <ShareButtons title={`Download ${movie.title} - Valorex`} />
            </div>
          </motion.div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
              <h2 className="font-display text-2xl font-bold">Related Movies</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {relatedMovies.map((relatedMovie, index) => (
                <Link to={`/movie/${relatedMovie.id}`} key={relatedMovie.id}>
                  <MovieCard
                    movie={{
                      id: relatedMovie.id,
                      title: relatedMovie.title,
                      date: relatedMovie.release_date || '',
                      info: relatedMovie.info || '',
                      poster: relatedMovie.poster_url || '',
                      downloadLink: relatedMovie.download_link || '',
                      category: (relatedMovie.category as 'hollywood' | 'bollywood') || 'hollywood',
                      language: (relatedMovie.language as 'english' | 'hindi' | 'dual') || 'english',
                      quality: relatedMovie.quality || '1080p',
                    }}
                    index={index}
                    onClick={() => {}}
                  />
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default MovieDetails;
