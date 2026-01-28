import { useState, useMemo } from 'react';
import { FileText, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlog } from '@/context/BlogContext';
import BlogCard from '@/components/BlogCard';
import Header from '@/components/Header';
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
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />
      
      {/* Luxury Background Effect with Floating Elements */}
      <div className="absolute inset-x-0 top-16 h-[500px] overflow-hidden -z-10">
        <div className="absolute inset-0 morph-bg" />
        
        {/* Floating 3D Orbs */}
        <motion.div 
          className="absolute top-20 left-[20%] w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
          animate={{ 
            y: [0, -25, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-gradient-to-bl from-accent/10 to-transparent blur-3xl"
          animate={{ 
            y: [0, 35, 0],
            x: [0, -25, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <main className="container py-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 perspective-container"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm"
            animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 animate-bounce-subtle" />
            Movie Articles
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-3d-deep">
            Premium{' '}
            <motion.span 
              className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[size:200%_100%]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Blog
            </motion.span>
          </h1>
          <motion.p 
            className="text-muted-foreground max-w-lg mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Exclusive articles and reviews about premium movies with download links.
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto mb-10"
        >
          <div className="relative glass-premium rounded-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 h-12 rounded-xl border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-muted-foreground glass-premium inline-flex px-4 py-2 rounded-full">
            Showing <span className="font-semibold text-foreground mx-1">{filteredPosts.length}</span> of <span className="font-semibold text-foreground mx-1">{posts.length}</span> articles
          </p>
        </motion.div>

        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <motion.div 
              className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 neon-glow"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <FileText className="w-10 h-10 text-muted-foreground" />
            </motion.div>
            <p className="text-muted-foreground text-lg">
              {searchQuery ? 'No articles found matching your search.' : 'No blog posts yet.'}
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Blog;
