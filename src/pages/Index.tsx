import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovies } from '@/context/MovieContext';
import Header from '@/components/Header';
import NetflixFilters from '@/components/NetflixFilters';
import HorizontalMovieCard from '@/components/HorizontalMovieCard';
import HeroBanner from '@/components/HeroBanner';
import Pagination from '@/components/Pagination';
import { CategoryFilter, LanguageFilter, Movie } from '@/types/movie';
import { Loader2, TrendingUp, Sparkles, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MOVIES_PER_PAGE = 12;

const Index = () => {
  const { movies, loading } = useMovies();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch featured movies for slider
  useEffect(() => {
    const fetchFeatured = async () => {
      const { data } = await supabase
        .from('movies')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        const mapped: Movie[] = data.map((m) => ({
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
        setFeaturedMovies(mapped);
      } else {
        // Fallback to first 5 movies if no featured ones
        setFeaturedMovies(movies.slice(0, 5));
      }
    };
    
    if (!loading) {
      fetchFeatured();
    }
  }, [movies, loading]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesCategory = categoryFilter === 'all' || movie.category === categoryFilter;
      const matchesLanguage = languageFilter === 'all' || movie.language === languageFilter;
      return matchesCategory && matchesLanguage;
    });
  }, [movies, categoryFilter, languageFilter]);

  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(start, start + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Page animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Group movies by category for rows
  const recentMovies = filteredMovies.slice(0, 12);
  const hollywoodMovies = movies.filter(m => m.category === 'hollywood').slice(0, 12);
  const bollywoodMovies = movies.filter(m => m.category === 'bollywood').slice(0, 12);

  const MovieRow = ({ title, icon: Icon, movies: rowMovies }: { title: string; icon: React.ElementType; movies: Movie[] }) => (
    <motion.section variants={itemVariants} className="mb-10">
      <div className="container">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl md:text-2xl font-bold">{title}</h2>
        </div>
      </div>
      
      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 md:px-8 lg:px-12 pb-4">
          {rowMovies.map((movie, index) => (
            <Link to={`/movie/${movie.id}`} key={movie.id}>
              <HorizontalMovieCard movie={movie} index={index} />
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <Header />
      
      {/* Hero Banner - Full Width */}
      <motion.section variants={itemVariants}>
        {!loading && (featuredMovies.length > 0 || movies.length > 0) && (
          <HeroBanner movies={featuredMovies.length > 0 ? featuredMovies : movies} />
        )}
      </motion.section>

      {/* Filters */}
      <motion.section variants={itemVariants} className="container py-6">
        <NetflixFilters
          categoryFilter={categoryFilter}
          onCategoryChange={(c) => { setCategoryFilter(c); handleFilterChange(); }}
          languageFilter={languageFilter}
          onLanguageChange={(l) => { setLanguageFilter(l); handleFilterChange(); }}
        />
      </motion.section>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Trending Row */}
          {recentMovies.length > 0 && (
            <MovieRow title="Trending Now" icon={TrendingUp} movies={recentMovies} />
          )}

          {/* Hollywood Row */}
          {hollywoodMovies.length > 0 && (
            <MovieRow title="Hollywood" icon={Sparkles} movies={hollywoodMovies} />
          )}

          {/* Bollywood Row */}
          {bollywoodMovies.length > 0 && (
            <MovieRow title="Bollywood" icon={Clock} movies={bollywoodMovies} />
          )}

          {/* All Movies Grid with Pagination */}
          {paginatedMovies.length > 0 && (
            <motion.section variants={itemVariants} className="container mb-16">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-bold">All Movies</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredMovies.length} movies
                </p>
              </div>
              
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 pb-4">
                  {paginatedMovies.map((movie, index) => (
                    <Link to={`/movie/${movie.id}`} key={movie.id}>
                      <HorizontalMovieCard movie={movie} index={index} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </motion.section>
          )}

          {filteredMovies.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <p className="text-muted-foreground text-lg">No movies found matching your criteria</p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Index;
