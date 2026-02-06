import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';

interface VerticalMovieCardProps {
  movie: Movie;
  index: number;
}

const VerticalMovieCard = ({ movie, index }: VerticalMovieCardProps) => {
  const hasNormalPrint = !!movie.normalPrintLink;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ scale: 1.03 }}
      className="group cursor-pointer relative"
    >
      {/* Landscape Image Container - 16:9 aspect ratio with larger size */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-muted">
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

        {/* Normal Print Play Button - Visible when link available */}
        {hasNormalPrint && (
          <Link
            to={`/watch/${movie.id}?quality=normal`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-14 right-3 z-10"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm shadow-lg"
            >
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
            </motion.div>
          </Link>
        )}
        
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
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Title Gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 to-transparent">
          <h3 className="font-semibold text-base leading-tight line-clamp-1 text-foreground">
            {movie.title}
          </h3>
          <p className="text-sm text-muted-foreground capitalize mt-1">
            {movie.category} • {movie.date}
          </p>
        </div>
      </div>
    </motion.article>
  );
};

export default VerticalMovieCard;
