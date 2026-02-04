import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovies } from '@/context/MovieContext';
import Header from '@/components/Header';
import NetflixFilters from '@/components/NetflixFilters';
import VerticalMovieCard from '@/components/VerticalMovieCard';
import HeroBanner from '@/components/HeroBanner';
import Pagination from '@/components/Pagination';
import RequestMovieDialog from '@/components/RequestMovieDialog';
import { CategoryFilter, LanguageFilter, Movie } from '@/types/movie';
import { Loader2 } from 'lucide-react';
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

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <Header />
      
      {/* Hero Banner - Full Width Edge to Edge */}
      <motion.section variants={itemVariants}>
        {!loading && (featuredMovies.length > 0 || movies.length > 0) && (
          <HeroBanner movies={featuredMovies.length > 0 ? featuredMovies : movies} />
        )}
      </motion.section>

      {/* Filters and Request Button */}
      <motion.section variants={itemVariants} className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <NetflixFilters
            categoryFilter={categoryFilter}
            onCategoryChange={(c) => { setCategoryFilter(c); handleFilterChange(); }}
            languageFilter={languageFilter}
            onLanguageChange={(l) => { setLanguageFilter(l); handleFilterChange(); }}
          />
          <RequestMovieDialog />
        </div>
      </motion.section>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* All Movies Grid - Vertical Scroll with Pagination */}
          {paginatedMovies.length > 0 && (
            <motion.section variants={itemVariants} className="px-4 sm:px-6 md:px-8 lg:px-12 pb-16">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl md:text-2xl font-bold">All Movies</h2>
                <p className="text-sm text-muted-foreground">
                  {filteredMovies.length} movies
                </p>
              </div>
              
              {/* Responsive Grid - Vertical Scrollable */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedMovies.map((movie, index) => (
                  <Link to={`/movie/${movie.id}`} key={movie.id}>
                    <VerticalMovieCard movie={movie} index={index} />
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </motion.section>
          )}

          {filteredMovies.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20 px-4">
              <p className="text-muted-foreground text-lg">No movies found matching your criteria</p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Index;
