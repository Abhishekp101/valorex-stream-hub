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
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      {/* Luxury Background Effect with Floating Elements */}
      <div className="absolute inset-x-0 top-16 h-[500px] overflow-hidden -z-10">
        <div className="absolute inset-0 morph-bg" />
        
        {/* Floating 3D Orbs */}
        <motion.div 
          className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl parallax-float-1"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-[20%] w-96 h-96 rounded-full bg-gradient-to-bl from-accent/10 to-transparent blur-3xl parallax-float-2"
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute top-60 left-[40%] w-64 h-64 rounded-full bg-gradient-to-tr from-primary/5 to-accent/5 blur-2xl parallax-float-3"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>
      
      <main className="container py-8 relative">
        {/* Hero Section with 3D Text */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative perspective-container"
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm"
              animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 animate-bounce-subtle" />
              Premium Collection
            </motion.div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-3d-deep">
              Download and Watch Online{' '}
              <motion.span 
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[size:200%_100%]"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Premium
              </motion.span>{' '}
              Movies
            </h1>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your exclusive gateway to the finest Hollywood & Bollywood cinema in stunning HD quality
            </motion.p>
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

        {/* Results Count with Animation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground glass-premium inline-flex px-4 py-2 rounded-full">
            Showing <span className="font-semibold text-foreground mx-1">{paginatedMovies.length}</span> of <span className="font-semibold text-foreground mx-1">{filteredMovies.length}</span> movies
          </p>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
        ) : paginatedMovies.length > 0 ? (
          <motion.section 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-muted-foreground text-lg">No movies found matching your criteria</p>
          </motion.div>
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
