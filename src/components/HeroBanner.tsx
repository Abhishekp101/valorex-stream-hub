import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronLeft, ChevronRight, Star, Clock, Calendar } from 'lucide-react';
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden mb-12">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={currentMovie.poster}
            alt={currentMovie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl space-y-4"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </span>
              </motion.div>

              {/* Title */}
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {currentMovie.title}
              </h2>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {currentMovie.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  2h 15min
                </span>
                <span className="px-2 py-0.5 rounded bg-secondary text-secondary-foreground capitalize">
                  {currentMovie.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground">
                  {currentMovie.quality}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground line-clamp-3 max-w-md">
                {currentMovie.info || "Experience the ultimate cinematic journey with stunning visuals and captivating storytelling."}
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link to={`/watch/${currentMovie.id}`}>
                  <Button size="lg" className="gap-2">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Watch Now
                  </Button>
                </Link>
                <Link to={`/movie/${currentMovie.id}`}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <Plus className="w-5 h-5" />
                    More Info
                  </Button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={handlePrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={handleNext}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {featuredMovies.map((movie, idx) => (
          <motion.button
            key={movie.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
              idx === currentIndex 
                ? 'ring-2 ring-primary scale-110' 
                : 'opacity-60 hover:opacity-100'
            }`}
            whileHover={{ scale: idx === currentIndex ? 1.1 : 1.05 }}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30">
        <motion.div
          key={currentIndex}
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default HeroBanner;
