import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 cursor-pointer perspective-container"
      >
        <div className="card-3d-subtle luxury-glow">
          <div className="aspect-video overflow-hidden rounded-t-xl">
            <img
              src={post.poster}
              alt={post.movieName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.createdAt}</span>
          </div>
          <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
            {post.movieName}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {post.article}
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
            Read More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
        </div>
      </motion.article>
    </Link>
  );
};

export default BlogCard;
