import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMovies } from '@/context/MovieContext';

interface SearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPopup = ({ isOpen, onClose }: SearchPopupProps) => {
  const [query, setQuery] = useState('');
  const { movies } = useMovies();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-8"
          >
            <div className="max-w-3xl mx-auto">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies..."
                  className="w-full pl-11 sm:pl-14 pr-11 sm:pr-14 py-4 sm:py-5 text-base sm:text-xl rounded-xl sm:rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={onClose}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Results */}
              {query && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 sm:mt-4 rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden max-h-[60vh] overflow-y-auto"
                >
                  {filteredMovies.length > 0 ? (
                    <div className="divide-y divide-border">
                      {filteredMovies.map((movie) => (
                        <Link
                          key={movie.id}
                          to={`/movie/${movie.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-secondary/50 transition-colors"
                        >
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            className="w-14 h-9 sm:w-16 sm:h-10 object-cover rounded-md sm:rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate text-sm sm:text-base">{movie.title}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                              {movie.category} • {movie.language} • {movie.quality}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Film className="w-12 h-12 mb-3 opacity-50" />
                      <p>No results found for "{query}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchPopup;
