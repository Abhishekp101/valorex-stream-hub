import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Film, FileText, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlog } from '@/context/BlogContext';
import BlogCard from '@/components/BlogCard';
import ThemeToggle from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';

const Blog = () => {
  const { posts } = useBlog();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    return posts.filter((post) =>
      post.movieName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Luxury Background Effect */}
      <div className="absolute inset-x-0 top-16 h-96 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
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

      <main className="container py-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            Movie Articles
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Premium <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Exclusive articles and reviews about premium movies with download links.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 h-12 rounded-xl border-border bg-card/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'No articles found matching your search.' : 'No blog posts yet.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
