import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Calendar, Film, Star, Clock, Globe, Play, Plus, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import HorizontalMovieCard from '@/components/HorizontalMovieCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Movie } from '@/types/movie';

interface MovieDB {
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
  const [movie, setMovie] = useState<MovieDB | null>(null);
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
          .limit(10);
        
        if (relatedData) {
          const mapped: Movie[] = relatedData.map((m) => ({
            id: m.id,
            title: m.title,
            poster: m.poster_url || '',
            date: m.release_date || '',
            category: (m.category as 'hollywood' | 'bollywood') || 'hollywood',
            language: (m.language as 'english' | 'hindi' | 'dual') || 'english',
            quality: m.quality || '1080p',
            info: m.info || '',
            downloadLink: m.download_link || '',
            videoLink: m.video_link || '',
          }));
          setRelatedMovies(mapped);
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
        <div className="relative w-screen -ml-[calc((100vw-100%)/2)] h-[70vh]">
          <Skeleton className="w-full h-full" />
        </div>
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
      
      {/* Full-Screen Hero Background */}
      <div className="relative w-screen -ml-[calc((100vw-100%)/2)] h-[80vh] md:h-[85vh] overflow-hidden">
        {movie.poster_url && (
          <>
            <motion.img
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7 }}
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover object-top"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          </>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end pb-16 md:pb-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl space-y-4"
            >
              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {movie.title}
              </h1>

              {/* Description */}
              <p className="text-muted-foreground line-clamp-3 text-base md:text-lg max-w-xl">
                {movie.info || "Experience an unforgettable cinematic journey with stunning visuals and captivating storytelling."}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-foreground font-medium">4.5</span>
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  2h 30m
                </span>
                {movie.release_date && (
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {movie.release_date}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  {movie.quality || 'HD'}
                </span>
                {movie.language && (
                  <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                    {movie.language}
                  </span>
                )}
              </div>

              {/* Genre Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {['Action', 'Drama', 'Thriller'].map((genre, i) => (
                  <span 
                    key={genre}
                    className="text-sm text-foreground underline underline-offset-4 hover:text-primary cursor-pointer transition-colors"
                  >
                    {genre}
                    {i < 2 && <span className="text-muted-foreground ml-2">•</span>}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                {movie.video_link ? (
                  <Link to={`/watch/${movie.id}`}>
                    <Button size="lg" className="gap-2 h-12 px-6 text-base">
                      <Play className="w-5 h-5" fill="currentColor" />
                      Play
                    </Button>
                  </Link>
                ) : movie.download_link ? (
                  <a href={movie.download_link} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="gap-2 h-12 px-6 text-base">
                      <Play className="w-5 h-5" fill="currentColor" />
                      Play
                    </Button>
                  </a>
                ) : null}
                
                <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full bg-secondary/80 backdrop-blur-sm hover:bg-secondary">
                  <Plus className="w-5 h-5" />
                </Button>
                
                <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full bg-secondary/80 backdrop-blur-sm hover:bg-secondary">
                  <Share2 className="w-5 h-5" />
                </Button>
                
                {movie.download_link && (
                  <a href={movie.download_link} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full backdrop-blur-sm">
                      <Download className="w-5 h-5" />
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container py-8">
        {/* Language Badge */}
        {movie.language && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium capitalize">
              <Globe className="w-4 h-4" />
              {movie.language}
            </span>
          </motion.div>
        )}

        <Tabs defaultValue="related" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 gap-6">
            <TabsTrigger 
              value="related"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-base"
            >
              Related
            </TabsTrigger>
            <TabsTrigger 
              value="details"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 pb-3 text-base"
            >
              Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="related" className="mt-6">
            {relatedMovies.length > 0 ? (
              <div className="overflow-x-auto scrollbar-hide -mx-4">
                <div className="flex gap-4 px-4 pb-4">
                  {relatedMovies.map((relatedMovie, index) => (
                    <Link to={`/movie/${relatedMovie.id}`} key={relatedMovie.id}>
                      <HorizontalMovieCard movie={relatedMovie} index={index} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12">No related movies found</p>
            )}
          </TabsContent>
          
          <TabsContent value="details" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground text-sm">Title</span>
                  <p className="font-medium">{movie.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Release Date</span>
                  <p className="font-medium">{movie.release_date || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Category</span>
                  <p className="font-medium capitalize">{movie.category || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-muted-foreground text-sm">Language</span>
                  <p className="font-medium capitalize">{movie.language || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-sm">Quality</span>
                  <p className="font-medium">{movie.quality || 'N/A'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MovieDetails;
