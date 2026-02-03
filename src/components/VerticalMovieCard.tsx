import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Movie } from '@/types/movie';

interface VerticalMovieCardProps {
  movie: Movie;
  index: number;
}

const VerticalMovieCard = ({ movie, index }: VerticalMovieCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.02 }}
      className="group cursor-pointer relative"
    >
      {/* Landscape Image Container - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quality Badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold rounded bg-primary text-primary-foreground">
            {movie.quality}
          </span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-background/80 backdrop-blur-sm text-foreground capitalize">
            {movie.language}
          </span>
        </div>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Title Gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 text-foreground">
            {movie.title}
          </h3>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {movie.category} • {movie.date}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export default VerticalMovieCard;
