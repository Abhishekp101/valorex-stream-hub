import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlog } from '@/context/BlogContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const BlogAdmin = () => {
  const { posts, addPost, deletePost, loading } = useBlog();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    movieName: '',
    article: '',
    poster: '',
    downloadLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.movieName || !formData.article || !formData.poster || !formData.downloadLink) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addPost(formData);
      toast({
        title: 'Success',
        description: 'Blog post published successfully!',
      });
      setFormData({
        movieName: '',
        article: '',
        poster: '',
        downloadLink: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish post',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      toast({
        title: 'Deleted',
        description: 'Blog post deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You need admin privileges to manage blog posts.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Add Blog Post Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Blog Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Movie Name *</label>
            <input
              type="text"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              required
              placeholder="Enter movie name"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Poster URL *</label>
            <input
              type="url"
              name="poster"
              value={formData.poster}
              onChange={handleChange}
              required
              placeholder="https://example.com/poster.jpg"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Article *</label>
            <textarea
              name="article"
              value={formData.article}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your article about the movie..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Download Link *</label>
            <input
              type="url"
              name="downloadLink"
              value={formData.downloadLink}
              onChange={handleChange}
              required
              placeholder="https://example.com/download"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 font-display font-semibold text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publishing...
              </>
            ) : (
              'Publish Post'
            )}
          </button>
        </form>
      </motion.section>

      {/* Blog Posts List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6">
          All Posts ({posts.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <img
                  src={post.poster}
                  alt={post.movieName}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{post.movieName}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {post.article.substring(0, 50)}...
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-shrink-0 p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default BlogAdmin;
