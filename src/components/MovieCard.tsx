import { motion } from 'framer-motion';
import { Calendar, Play, Star } from 'lucide-react';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
  onClick: () => void;
  index: number;
}

const MovieCard = ({ movie, onClick, index }: MovieCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      {/* Force horizontal poster everywhere (16:9) */}
      <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Quality Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-md bg-primary text-primary-foreground">
            {movie.quality}
          </span>
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
          <motion.div 
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </motion.div>
        </div>
        
        {/* Category Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-secondary/90 backdrop-blur-sm text-secondary-foreground capitalize">
            {movie.category}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{movie.date}</span>
          <span className="mx-1">•</span>
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>4.5</span>
        </div>
        <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
      </div>
    </motion.article>
  );
};

export default MovieCard;
