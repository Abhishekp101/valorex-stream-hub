import { Link } from 'react-router-dom';
import { Film, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlog } from '@/context/BlogContext';
import BlogCard from '@/components/BlogCard';
import ThemeToggle from '@/components/ThemeToggle';

const Blog = () => {
  const { posts } = useBlog();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Valorex</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Movies
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-foreground"
            >
              Blog
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm mb-4">
            <FileText className="w-4 h-4" />
            Movie Articles
          </div>
          <h1 className="font-display text-4xl font-bold mb-3">Blog</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Read our latest articles and reviews about movies with download links.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No blog posts yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Blog;
