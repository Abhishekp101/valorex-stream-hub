import { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMovies } from '@/context/MovieContext';
import { useAuth } from '@/context/AuthContext';
import { Movie } from '@/types/movie';
import { useToast } from '@/hooks/use-toast';

const MovieAdmin = () => {
  const { movies, addMovie, deleteMovie, loading } = useMovies();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    date: '',
    category: 'hollywood' as Movie['category'],
    language: 'dual' as Movie['language'],
    quality: 'WEB-DL',
    info: '',
    downloadLink: '',
    videoLink: '',
    normalPrintLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.poster || !formData.downloadLink) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addMovie(formData);
      toast({
        title: 'Success',
        description: 'Movie added successfully!',
      });
      setFormData({
        title: '',
        poster: '',
        date: '',
        category: 'hollywood',
        language: 'dual',
        quality: 'WEB-DL',
        info: '',
        downloadLink: '',
        videoLink: '',
        normalPrintLink: '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add movie',
        variant: 'destructive',
      });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovie(id);
      toast({
        title: 'Deleted',
        description: 'Movie deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete movie',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You need admin privileges to manage movies.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Add Movie Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add New Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Movie Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter movie title"
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Release Date</label>
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="22 Jan 2026"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Quality</label>
              <input
                type="text"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                placeholder="WEB-DL"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="hollywood">Hollywood</option>
                <option value="bollywood">Bollywood</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="dual">Dual Audio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Movie Info</label>
            <textarea
              name="info"
              value={formData.info}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description of the movie..."
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

          <div>
            <label className="block text-sm font-medium mb-1.5">Video Link (Google Drive - HD)</label>
            <input
              type="url"
              name="videoLink"
              value={formData.videoLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">HD quality streaming link</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Normal Print Link (Google Drive)</label>
            <input
              type="url"
              name="normalPrintLink"
              value={formData.normalPrintLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">Normal quality streaming link (shows play button on cards)</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 font-display font-semibold text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Movie'
            )}
          </button>
        </form>
      </motion.section>

      {/* Movies List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6">
          All Movies ({movies.length})
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-16 aspect-video object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {movie.category} • {movie.language}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(movie.id)}
                  className="flex-shrink-0 p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete movie"
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

export default MovieAdmin;
