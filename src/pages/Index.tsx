import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '@/context/MovieContext';
import Header from '@/components/Header';
import SearchFilters from '@/components/SearchFilters';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { CategoryFilter, LanguageFilter } from '@/types/movie';
import { Loader2 } from 'lucide-react';

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
      
      <main className="container py-8">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Download Movies
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Your destination for the latest Hollywood & Bollywood movies in HD quality
          </p>
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
