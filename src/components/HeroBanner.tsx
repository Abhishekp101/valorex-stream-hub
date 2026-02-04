import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/movie';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  movies: Movie[];
}

const HeroBanner = ({ movies }: HeroBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredMovies = movies.slice(0, 5);

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image - Full Width Edge to Edge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={currentMovie.poster}
            alt={currentMovie.title}
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-12 sm:pb-16 md:pb-20">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-3 sm:space-y-4"
            >
              {/* Language Tags */}
              <div className="flex items-center gap-2 text-sm sm:text-base text-foreground/90 font-medium">
                <span className="capitalize">{currentMovie.language === 'dual' ? 'English | Hindi' : currentMovie.language}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {currentMovie.title}
              </h1>

              {/* Description */}
              <p className="text-muted-foreground line-clamp-2 text-sm sm:text-base md:text-lg max-w-xl">
                {currentMovie.info || "Experience the ultimate cinematic journey with stunning visuals and captivating storytelling."}
              </p>

              {/* Action Buttons - Watch Now + Plus only */}
              <div className="flex items-center gap-3 pt-2">
                <Link to={`/watch/${currentMovie.id}`}>
                  <Button size="lg" className="gap-2 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
                    Watch Now
                  </Button>
                </Link>
                <Link to={`/movie/${currentMovie.id}`}>
                  <Button size="icon" variant="secondary" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators - Simple Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex 
                ? 'w-6 sm:w-8 h-2 bg-white' 
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
