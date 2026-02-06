import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Globe, Play, Download, ChevronDown, Tv, Film } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface Episode {
  id: string;
  episode_number: number;
  title: string;
  video_link: string | null;
  download_link: string | null;
  duration: string | null;
}

interface Season {
  id: string;
  season_number: number;
  title: string | null;
  episodes: Episode[];
}

interface Series {
  id: string;
  title: string;
  poster_url: string | null;
  release_date: string | null;
  category: string | null;
  language: string | null;
  info: string | null;
  seasons: Season[];
}

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchSeries();
  }, [id]);

  const fetchSeries = async () => {
    setLoading(true);
    const { data: seriesData, error } = await supabase
      .from('web_series')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !seriesData) {
      setLoading(false);
      return;
    }

    // Fetch seasons
    const { data: seasonsData } = await supabase
      .from('seasons')
      .select('*')
      .eq('series_id', id)
      .order('season_number');

    const seasons: Season[] = await Promise.all(
      (seasonsData || []).map(async (season) => {
        const { data: episodesData } = await supabase
          .from('episodes')
          .select('*')
          .eq('season_id', season.id)
          .order('episode_number');

        return { ...season, episodes: episodesData || [] };
      })
    );

    setSeries({ ...seriesData, seasons });
    setLoading(false);
  };

  const getEmbedUrl = (driveUrl: string) => {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return driveUrl;
  };

  const totalEpisodes = series?.seasons.reduce((sum, s) => sum + s.episodes.length, 0) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Skeleton className="w-full aspect-video max-w-3xl mx-auto rounded-xl mb-8" />
          <Skeleton className="h-10 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <Tv className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Series not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Hero */}
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <img
              src={series.poster_url || ''}
              alt={series.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{series.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {series.release_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {series.release_date}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {series.language}
                </span>
                <span className="px-2 py-1 bg-primary/20 rounded text-primary capitalize">
                  {series.category}
                </span>
                <span className="px-2 py-1 bg-secondary rounded">
                  {series.seasons.length} Season{series.seasons.length !== 1 ? 's' : ''} • {totalEpisodes} Episodes
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {series.info && (
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">{series.info}</p>
          )}

          {/* Seasons & Episodes */}
          <h2 className="text-2xl font-bold mb-4">Seasons & Episodes</h2>
          
          {series.seasons.length === 0 ? (
            <div className="text-center py-12 bg-secondary/30 rounded-xl">
              <Film className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No episodes available yet.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-3" defaultValue={series.seasons[0]?.id}>
              {series.seasons.map((season) => (
                <AccordionItem
                  key={season.id}
                  value={season.id}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="font-bold text-primary">{season.season_number}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{season.title || `Season ${season.season_number}`}</h3>
                        <p className="text-sm text-muted-foreground">{season.episodes.length} Episodes</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-2 mt-2">
                      {season.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                              {ep.episode_number}
                            </span>
                            <div>
                              <h4 className="font-medium">{ep.title}</h4>
                              {ep.duration && (
                                <p className="text-xs text-muted-foreground">{ep.duration}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {ep.video_link && (
                              <Link to={`/watch-episode/${ep.id}`}>
                                <Button size="sm" className="gap-1">
                                  <Play className="w-4 h-4" />
                                  Watch
                                </Button>
                              </Link>
                            )}
                            {ep.download_link && (
                              <a href={ep.download_link} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" variant="outline" className="gap-1">
                                  <Download className="w-4 h-4" />
                                  Download
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SeriesDetails;
