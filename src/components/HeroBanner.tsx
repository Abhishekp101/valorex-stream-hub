import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronLeft, ChevronRight, Star, Clock, Calendar, Download } from 'lucide-react';
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
    <div className="relative w-screen -ml-[calc((100vw-100%)/2)] h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image - Full Width */}
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
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl space-y-4"
            >
              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {currentMovie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-foreground font-medium">4.5</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  2h 15m
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {currentMovie.date}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold">
                  {currentMovie.quality}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium capitalize">
                  {currentMovie.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-muted-foreground line-clamp-2 max-w-xl text-base md:text-lg">
                {currentMovie.info || "Experience the ultimate cinematic journey with stunning visuals and captivating storytelling."}
              </p>

              {/* Genre Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {['Action', 'Drama', 'Thriller'].map((genre, i) => (
                  <span 
                    key={genre}
                    className="text-sm text-foreground underline underline-offset-4 hover:text-primary cursor-pointer transition-colors"
                  >
                    {genre}
                    {i < 2 && <span className="text-muted-foreground ml-2">•</span>}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Link to={`/watch/${currentMovie.id}`}>
                  <Button size="lg" className="gap-2 h-12 px-6 text-base">
                    <Play className="w-5 h-5" fill="currentColor" />
                    Play
                  </Button>
                </Link>
                <Link to={`/movie/${currentMovie.id}`}>
                  <Button size="lg" variant="secondary" className="gap-2 h-12 px-6 text-base bg-secondary/80 backdrop-blur-sm hover:bg-secondary">
                    <Plus className="w-5 h-5" />
                    More Info
                  </Button>
                </Link>
                {currentMovie.downloadLink && (
                  <a href={currentMovie.downloadLink} target="_blank" rel="noopener noreferrer">
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full backdrop-blur-sm">
                      <Download className="w-5 h-5" />
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-12 h-12 bg-background/30 backdrop-blur-md border border-border/50 hover:bg-background/50"
          onClick={handlePrev}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full w-12 h-12 bg-background/30 backdrop-blur-md border border-border/50 hover:bg-background/50"
          onClick={handleNext}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIndex 
                ? 'w-8 h-2 bg-primary' 
                : 'w-2 h-2 bg-muted-foreground/50 hover:bg-muted-foreground'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
