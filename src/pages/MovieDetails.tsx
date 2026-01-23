import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Film, Star } from 'lucide-react';
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8">
            <Skeleton className="aspect-[2/3] rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
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
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <p className="text-muted-foreground mb-6">The movie you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movies
        </Link>

        {/* Movie Details */}
        <div className="grid md:grid-cols-[300px_1fr] gap-8 mb-12">
          {/* Poster */}
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-border">
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-secondary flex items-center justify-center">
                <Film className="w-16 h-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {movie.category && (
                  <Badge variant="secondary" className="capitalize">
                    {movie.category}
                  </Badge>
                )}
                {movie.language && (
                  <Badge variant="outline" className="capitalize">
                    {movie.language}
                  </Badge>
                )}
                {movie.quality && (
                  <Badge className="bg-primary text-primary-foreground">
                    {movie.quality}
                  </Badge>
                )}
              </div>

              {movie.release_date && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.release_date}</span>
                </div>
              )}
            </div>

            {movie.info && (
              <div>
                <h2 className="font-semibold text-lg mb-2">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.info}
                </p>
              </div>
            )}

            {/* Download Button */}
            {movie.download_link && (
              <div className="pt-4">
                <a
                  href={movie.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    <Download className="w-5 h-5 mr-2" />
                    Download Movie
                  </Button>
                </a>
              </div>
            )}

            {/* Share Buttons */}
            <div className="pt-4 border-t border-border">
              <ShareButtons title={`Download ${movie.title} - Valorex`} />
            </div>
          </div>
        </div>

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <section>
            <h2 className="font-display text-2xl font-bold mb-6">Related Movies</h2>
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
          </section>
        )}
      </main>
    </div>
  );
};

export default MovieDetails;
