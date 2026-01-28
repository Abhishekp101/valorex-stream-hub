import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
  index?: number;
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer perspective-container gradient-border"
      >
        <div className="card-3d-subtle shine-effect">
          <div className="aspect-video overflow-hidden rounded-t-xl relative">
            <img
              src={post.poster}
              alt={post.movieName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <motion.div 
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.createdAt}</span>
            </div>
            <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors text-3d">
              {post.movieName}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
              {post.article}
            </p>
            <motion.span 
              className="inline-flex items-center gap-2 text-sm font-medium text-primary"
              whileHover={{ x: 5 }}
            >
              Read More
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default BlogCard;
