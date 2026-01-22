import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost } from '@/types/blog';

interface BlogContextType {
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

const samplePosts: BlogPost[] = [
  {
    id: '1',
    movieName: 'Oppenheimer',
    article: 'Christopher Nolan\'s epic biographical thriller about J. Robert Oppenheimer and the development of the atomic bomb. This masterpiece features stunning visuals and an incredible performance by Cillian Murphy.',
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    downloadLink: 'https://example.com/download/oppenheimer',
    createdAt: '2026-01-20',
  },
  {
    id: '2',
    movieName: 'Dune: Part Two',
    article: 'The continuation of Paul Atreides\' journey as he unites with Chani and the Fremen while seeking revenge against those who destroyed his family. Denis Villeneuve delivers another visual spectacle.',
    poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    downloadLink: 'https://example.com/download/dune2',
    createdAt: '2026-01-18',
  },
];

export const BlogProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('valorex-blog-posts');
    return saved ? JSON.parse(saved) : samplePosts;
  });

  useEffect(() => {
    localStorage.setItem('valorex-blog-posts', JSON.stringify(posts));
  }, [posts]);

  const addPost = (postData: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPosts((prev) => [newPost, ...prev]);
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  return (
    <BlogContext.Provider value={{ posts, addPost, deletePost }}>
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
