import { useParams, Link } from 'react-router-dom';
import { Film, ArrowLeft, Calendar, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlog } from '@/context/BlogContext';
import ThemeToggle from '@/components/ThemeToggle';
import ShareButtons from '@/components/ShareButtons';

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, loading } = useBlog();
  const post = posts.find((p) => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Valorex</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container py-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Image */}
          <div className="aspect-video overflow-hidden rounded-xl mb-8">
            <img
              src={post.poster}
              alt={post.movieName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.createdAt}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
            {post.movieName}
          </h1>

          {/* Share Buttons */}
          <div className="mb-8 pb-6 border-b border-border">
            <ShareButtons title={`${post.movieName} - Valorex Blog`} />
          </div>

          {/* Article Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {post.article}
            </p>
          </div>

          {/* Download Button */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <h3 className="font-display text-lg font-semibold mb-3">Download Movie</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click the button below to download {post.movieName}.
            </p>
            <a
              href={post.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download Now
            </a>
          </div>

          {/* Bottom Share */}
          <div className="mt-8 pt-6 border-t border-border">
            <ShareButtons title={`Download ${post.movieName} - Valorex`} />
          </div>
        </motion.article>
      </main>
    </div>
  );
};

export default BlogPost;
