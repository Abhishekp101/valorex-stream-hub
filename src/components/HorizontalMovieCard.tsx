import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Movie } from '@/types/movie';

interface HorizontalMovieCardProps {
  movie: Movie;
  index: number;
}

const HorizontalMovieCard = ({ movie, index }: HorizontalMovieCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      className="group cursor-pointer flex-shrink-0 relative"
    >
      {/* Landscape Image Container - 16:9 aspect ratio */}
      <div className="relative w-[280px] sm:w-[320px] md:w-[360px] aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quality Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md bg-primary text-primary-foreground">
            {movie.quality}
          </span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-background/80 backdrop-blur-sm text-foreground capitalize">
            {movie.language}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
            </motion.div>
          </div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-display font-semibold text-base leading-tight line-clamp-1 text-foreground">
              {movie.title}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {movie.category} • {movie.date}
            </p>
          </div>
        </div>

        {/* Default Bottom Gradient for Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent group-hover:opacity-0 transition-opacity">
          <h3 className="font-display font-semibold text-sm leading-tight line-clamp-1 text-foreground">
            {movie.title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
};

export default HorizontalMovieCard;
