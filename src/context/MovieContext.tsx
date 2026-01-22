import React, { createContext, useContext, useState } from 'react';
import { Movie } from '@/types/movie';
import { sampleMovies } from '@/data/sampleMovies';

interface MovieContextType {
  movies: Movie[];
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  deleteMovie: (id: string) => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('valorex-movies');
    return stored ? JSON.parse(stored) : sampleMovies;
  });

  const saveMovies = (newMovies: Movie[]) => {
    setMovies(newMovies);
    localStorage.setItem('valorex-movies', JSON.stringify(newMovies));
  };

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movie,
      id: Date.now().toString(),
    };
    saveMovies([newMovie, ...movies]);
  };

  const deleteMovie = (id: string) => {
    saveMovies(movies.filter(m => m.id !== id));
  };

  return (
    <MovieContext.Provider value={{ movies, addMovie, deleteMovie }}>
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
