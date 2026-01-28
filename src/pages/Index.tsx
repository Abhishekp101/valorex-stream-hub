import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMovies } from '@/context/MovieContext';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { CategoryFilter, LanguageFilter } from '@/types/movie';
import { Loader2, Sparkles } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Luxury Background Effect */}
      <div className="absolute inset-x-0 top-16 h-96 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>
      
      <main className="container py-8 relative">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm animate-glow-pulse">
              <Sparkles className="w-4 h-4" />
              Premium Collection
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4 text-3d">
              Download and Watch Online <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">Premium</span> Movies
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Your exclusive gateway to the finest Hollywood & Bollywood cinema in stunning HD quality
            </p>
          </motion.div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); handleFilterChange(); }}
            categoryFilter={categoryFilter}
            onCategoryChange={(c) => { setCategoryFilter(c); handleFilterChange(); }}
            languageFilter={languageFilter}
            onLanguageChange={(l) => { setLanguageFilter(l); handleFilterChange(); }}
          />
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedMovies.length} of {filteredMovies.length} movies
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : paginatedMovies.length > 0 ? (
          <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {paginatedMovies.map((movie, index) => (
              <Link to={`/movie/${movie.id}`} key={movie.id}>
                <MovieCard
                  movie={movie}
                  index={index}
                  onClick={() => {}}
                />
              </Link>
            ))}
          </section>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No movies found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
};

export default Index;
