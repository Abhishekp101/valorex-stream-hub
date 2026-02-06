export interface WebSeries {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
  category: 'hollywood' | 'bollywood';
  language: 'english' | 'hindi' | 'dual';
  info: string;
  seasons?: Season[];
}

export interface Season {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  videoLink?: string;
  downloadLink?: string;
  duration?: string;
}
