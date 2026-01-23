import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Movie } from '@/types/movie';

interface MovieContextType {
  movies: Movie[];
  loading: boolean;
  addMovie: (movie: Omit<Movie, 'id'>) => Promise<void>;
  deleteMovie: (id: string) => Promise<void>;
  refreshMovies: () => Promise<void>;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const mappedMovies: Movie[] = data.map((m) => ({
        id: m.id,
        title: m.title,
        poster: m.poster_url || '',
        date: m.release_date || '',
        category: (m.category as 'hollywood' | 'bollywood') || 'hollywood',
        language: (m.language as 'english' | 'hindi' | 'dual') || 'english',
        quality: m.quality || '1080p',
        info: m.info || '',
        downloadLink: m.download_link || '',
      }));
      setMovies(mappedMovies);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const addMovie = async (movie: Omit<Movie, 'id'>) => {
    const { error } = await supabase.from('movies').insert({
      title: movie.title,
      poster_url: movie.poster,
      release_date: movie.date,
      category: movie.category,
      language: movie.language,
      quality: movie.quality,
      info: movie.info,
      download_link: movie.downloadLink,
    });

    if (!error) {
      await fetchMovies();
    } else {
      throw new Error(error.message);
    }
  };

  const deleteMovie = async (id: string) => {
    const { error } = await supabase.from('movies').delete().eq('id', id);

    if (!error) {
      await fetchMovies();
    } else {
      throw new Error(error.message);
    }
  };

  const refreshMovies = async () => {
    await fetchMovies();
  };

  return (
    <MovieContext.Provider value={{ movies, loading, addMovie, deleteMovie, refreshMovies }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};
