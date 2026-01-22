import { motion } from 'framer-motion';
import { Calendar, Download } from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={post.poster}
          alt={post.movieName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
        <a
          href={post.downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          Download Now
        </a>
      </div>
    </motion.article>
  );
};

export default BlogCard;
