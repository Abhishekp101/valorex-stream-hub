import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Film, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface WatchHistoryItem {
  id: string;
  movieId: string;
  title: string;
  poster: string;
  progressSeconds: number;
  durationSeconds: number | null;
  lastWatchedAt: string;
}

const WatchHistory = () => {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('watch_history')
      .select(`
        id,
        movie_id,
        progress_seconds,
        duration_seconds,
        last_watched_at,
        movies (
          id,
          title,
          poster_url
        )
      `)
      .eq('user_id', user.id)
      .order('last_watched_at', { ascending: false });

    if (!error && data) {
      const mapped: WatchHistoryItem[] = data
        .filter((item: any) => item.movies)
        .map((item: any) => ({
          id: item.id,
          movieId: item.movies.id,
          title: item.movies.title,
          poster: item.movies.poster_url || '',
          progressSeconds: item.progress_seconds || 0,
          durationSeconds: item.duration_seconds,
          lastWatchedAt: item.last_watched_at,
        }));
      setHistory(mapped);
    }
    setLoading(false);
  };

  const formatProgress = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <History className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Sign in to view your Watch History</h1>
            <p className="text-muted-foreground mb-8">Track what you've watched and resume where you left off.</p>
            <Link to="/login">
              <Button size="lg" className="gap-2">
                Sign In
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
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <History className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Watch History</h1>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <Film className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
              <p className="text-muted-foreground mb-6">Start watching movies to build your history.</p>
              <Link to="/">
                <Button>Browse Movies</Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">{history.length} movies watched</p>
              <div className="space-y-3">
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:bg-secondary/50 transition-colors group"
                  >
                    <Link to={`/watch/${item.movieId}`} className="flex-shrink-0">
                      <div className="relative w-32 aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                        {/* Progress bar */}
                        {item.durationSeconds && item.durationSeconds > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/30">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${Math.min((item.progressSeconds / item.durationSeconds) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/movie/${item.movieId}`}>
                        <h3 className="font-semibold text-lg truncate hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        Watched {formatProgress(item.progressSeconds)} • {formatDate(item.lastWatchedAt)}
                      </p>
                    </div>
                    <Link to={`/watch/${item.movieId}`}>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Play className="w-4 h-4" />
                        Resume
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default WatchHistory;
