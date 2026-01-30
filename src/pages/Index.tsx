import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovies } from '@/context/MovieContext';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import MovieCard from '@/components/MovieCard';
import HeroBanner from '@/components/HeroBanner';
import Pagination from '@/components/Pagination';
import { CategoryFilter, LanguageFilter } from '@/types/movie';
import { Loader2, TrendingUp } from 'lucide-react';

const MOVIES_PER_PAGE = 10;

const Index = () => {
  const { movies, loading } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || movie.category === categoryFilter;
      const matchesLanguage = languageFilter === 'all' || movie.language === languageFilter;
      return matchesSearch && matchesCategory && matchesLanguage;
    });
  }, [movies, searchQuery, categoryFilter, languageFilter]);

  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(start, start + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Page intro animation variants
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
      
      <main className="container py-8">
        {/* Hero Banner */}
        <motion.section variants={itemVariants}>
          {!loading && movies.length > 0 && (
            <HeroBanner movies={movies} />
          )}
        </motion.section>

        {/* Trending Section Title */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-3 mb-6"
        >
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">Trending Now</h2>
        </motion.div>

        {/* Filters */}
        <motion.section variants={itemVariants} className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); handleFilterChange(); }}
            categoryFilter={categoryFilter}
            onCategoryChange={(c) => { setCategoryFilter(c); handleFilterChange(); }}
            languageFilter={languageFilter}
            onLanguageChange={(l) => { setLanguageFilter(l); handleFilterChange(); }}
          />
        </motion.section>

        {/* Results Count */}
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{paginatedMovies.length}</span> of <span className="font-semibold text-foreground">{filteredMovies.length}</span> movies
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : paginatedMovies.length > 0 ? (
          <motion.section 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {paginatedMovies.map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <MovieCard
                  movie={movie}
                  index={index}
                  onClick={() => {}}
                />
              </Link>
            ))}
          </motion.section>
        ) : (
          <motion.div variants={itemVariants} className="text-center py-20">
            <p className="text-muted-foreground text-lg">No movies found matching your criteria</p>
          </motion.div>
        )}

        {/* Pagination */}
        <motion.div variants={itemVariants}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </motion.div>
      </main>
    </motion.div>
  );
};

export default Index;
