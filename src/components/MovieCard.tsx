import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted shadow-valorex group-hover:shadow-valorex-hover transition-shadow duration-300">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded bg-valorex-badge text-valorex-badge-foreground">
            {movie.quality}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          <span>{movie.date}</span>
        </div>
        <h3 className="font-display font-medium text-sm leading-snug line-clamp-2 group-hover:text-muted-foreground transition-colors">
          {movie.title}
        </h3>
      </div>
    </motion.article>
  );
};

export default MovieCard;
