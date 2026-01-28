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
      className="group cursor-pointer perspective-container"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted shadow-valorex card-3d-subtle luxury-glow transition-all duration-500">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Quality Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md bg-valorex-badge text-valorex-badge-foreground shadow-lg">
            {movie.quality}
          </span>
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-primary/30">
            <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />
        
        {/* Category Tag */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-secondary/80 backdrop-blur-sm text-secondary-foreground capitalize">
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
