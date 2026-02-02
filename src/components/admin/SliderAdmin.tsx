import { useState, useEffect } from 'react';
import { Loader2, Star, StarOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface SliderMovie {
  id: string;
  title: string;
  poster_url: string | null;
  is_featured: boolean;
  category: string | null;
}

const SliderAdmin = () => {
  const [movies, setMovies] = useState<SliderMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('movies')
      .select('id, title, poster_url, is_featured, category')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMovies(data.map(m => ({
        ...m,
        is_featured: m.is_featured ?? false
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    setUpdating(id);
    
    const { error } = await supabase
      .from('movies')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    } else {
      setMovies(prev => 
        prev.map(m => m.id === id ? { ...m, is_featured: !currentStatus } : m)
      );
      toast({
        title: 'Updated',
        description: `Movie ${!currentStatus ? 'added to' : 'removed from'} slider`,
      });
    }
    
    setUpdating(null);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You need admin privileges to manage the slider.</p>
      </div>
    );
  }

  const featuredMovies = movies.filter(m => m.is_featured);
  const regularMovies = movies.filter(m => !m.is_featured);

  return (
    <div className="space-y-8">
      {/* Featured Movies Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
          <h2 className="font-display text-xl font-semibold">
            Featured in Slider ({featuredMovies.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : featuredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredMovies.map((movie) => (
              <div
                key={movie.id}
                className="relative group rounded-lg overflow-hidden border-2 border-amber-400/50 bg-secondary/30"
              >
                <img
                  src={movie.poster_url || '/placeholder.svg'}
                  alt={movie.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-medium text-sm truncate mb-2">{movie.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </span>
                    <Switch
                      checked={movie.is_featured}
                      onCheckedChange={() => toggleFeatured(movie.id, movie.is_featured)}
                      disabled={updating === movie.id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No movies in slider. Add movies from the list below.
          </p>
        )}
      </motion.section>

      {/* All Movies Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center gap-3 mb-6">
          <StarOff className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-display text-xl font-semibold">
            All Movies ({regularMovies.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {regularMovies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <img
                  src={movie.poster_url || '/placeholder.svg'}
                  alt={movie.title}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground capitalize">
                    {movie.category || 'Uncategorized'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Add to Slider</span>
                  <Switch
                    checked={movie.is_featured}
                    onCheckedChange={() => toggleFeatured(movie.id, movie.is_featured)}
                    disabled={updating === movie.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default SliderAdmin;
