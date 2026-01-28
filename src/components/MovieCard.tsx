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
      initial={{ opacity: 0, y: 30, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileHover={{ y: -12, scale: 1.03, rotateY: -3 }}
      className="group cursor-pointer perspective-container"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted card-3d-tilt gradient-border shine-effect">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Animated Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/0 via-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quality Badge with Pulse */}
        <motion.div 
          className="absolute top-3 left-3"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md bg-valorex-badge text-valorex-badge-foreground shadow-lg neon-glow">
            {movie.quality}
          </span>
        </motion.div>
        
        {/* Play Overlay with 3D Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <motion.div 
            className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/50"
            initial={{ scale: 0, rotateZ: -180 }}
            whileHover={{ scale: 1.1 }}
            animate={{ scale: 1, rotateZ: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Play className="w-7 h-7 text-primary-foreground ml-1" fill="currentColor" />
          </motion.div>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
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
