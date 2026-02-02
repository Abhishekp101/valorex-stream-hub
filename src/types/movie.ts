export interface Movie {
  id: string;
  title: string;
  poster: string;
  date: string;
  category: 'hollywood' | 'bollywood';
  language: 'english' | 'hindi' | 'dual';
  quality: string;
  info: string;
  downloadLink: string;
  videoLink?: string;
  isFeatured?: boolean;
}

export type CategoryFilter = 'all' | 'hollywood' | 'bollywood';
export type LanguageFilter = 'all' | 'english' | 'hindi' | 'dual';
