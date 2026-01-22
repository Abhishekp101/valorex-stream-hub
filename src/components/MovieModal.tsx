import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Calendar, Film, Globe } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  if (!movie) return null;

  const getCategoryLabel = (category: string) => {
    return category === 'hollywood' ? 'Hollywood' : 'Bollywood';
  };

  const getLanguageLabel = (language: string) => {
    switch (language) {
      case 'dual': return 'Dual Audio';
      case 'hindi': return 'Hindi';
      case 'english': return 'English';
      default: return language;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-secondary transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover md:rounded-l-xl"
                />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded bg-valorex-badge text-valorex-badge-foreground">
                    {movie.quality}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-bold leading-tight mb-3">
                  {movie.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                    <Film className="w-3.5 h-3.5" />
                    {getCategoryLabel(movie.category)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                    <Globe className="w-3.5 h-3.5" />
                    {getLanguageLabel(movie.language)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {movie.date}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-2">
                  About
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {movie.info}
                </p>
              </div>

              <a
                href={movie.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 font-display font-semibold text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                Download Now
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;
