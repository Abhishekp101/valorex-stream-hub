import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost } from '@/types/blog';

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  addPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mappedPosts: BlogPost[] = data.map((p) => ({
        id: p.id,
        movieName: p.movie_name,
        article: p.article || '',
        poster: p.poster_url || '',
        downloadLink: p.download_link || '',
        createdAt: p.created_at.split('T')[0],
      }));
      setPosts(mappedPosts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (postData: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const { error } = await supabase.from('blog_posts').insert({
      movie_name: postData.movieName,
      article: postData.article,
      poster_url: postData.poster,
      download_link: postData.downloadLink,
    });

    if (!error) {
      await fetchPosts();
    } else {
      throw new Error(error.message);
    }
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (!error) {
      await fetchPosts();
    } else {
      throw new Error(error.message);
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <BlogContext.Provider value={{ posts, loading, addPost, deletePost, refreshPosts }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
