import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Episode {
  id: string;
  season_id: string;
  episode_number: number;
  title: string;
  video_link: string | null;
  download_link: string | null;
  duration: string | null;
}

interface Season {
  id: string;
  series_id: string;
  season_number: number;
  title: string | null;
}

interface Series {
  id: string;
  title: string;
  poster_url: string | null;
}

const WatchEpisode = () => {
  const { id } = useParams<{ id: string }>();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [series, setSeries] = useState<Series | null>(null);
  const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchEpisode();
  }, [id]);

  const fetchEpisode = async () => {
    setLoading(true);
    
    // Fetch episode
    const { data: epData, error } = await supabase
      .from('episodes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !epData) {
      setLoading(false);
      return;
    }
    setEpisode(epData);

    // Fetch season
    const { data: seasonData } = await supabase
      .from('seasons')
      .select('*')
      .eq('id', epData.season_id)
      .single();

    if (seasonData) {
      setSeason(seasonData);

      // Fetch series
      const { data: seriesData } = await supabase
        .from('web_series')
        .select('id, title, poster_url')
        .eq('id', seasonData.series_id)
        .single();

      if (seriesData) setSeries(seriesData);

      // Fetch all episodes in this season for navigation
      const { data: epsData } = await supabase
        .from('episodes')
        .select('*')
        .eq('season_id', epData.season_id)
        .order('episode_number');

      if (epsData) setAllEpisodes(epsData);
    }

    setLoading(false);
  };

  const getEmbedUrl = (driveUrl: string) => {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return driveUrl;
  };

  const currentIndex = allEpisodes.findIndex((e) => e.id === id);
  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Skeleton className="w-full aspect-video rounded-xl" />
        </div>
      </div>
    );
  }

  if (!episode || !episode.video_link) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <Tv className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Episode not available</h1>
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
      
      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back Link */}
          {series && (
            <Link
              to={`/series/${series.id}`}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {series.title}
            </Link>
          )}

          {/* Episode Title */}
          <h1 className="text-2xl font-bold mb-2">
            S{season?.season_number}E{episode.episode_number}: {episode.title}
          </h1>
          {series && (
            <p className="text-muted-foreground mb-6">{series.title}</p>
          )}

          {/* Video Player */}
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-6">
            <iframe
              src={getEmbedUrl(episode.video_link)}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevEpisode ? (
              <Link to={`/watch-episode/${prevEpisode.id}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Prev: E{prevEpisode.episode_number}
                </Button>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              {episode.download_link && (
                <a href={episode.download_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download Episode
                  </Button>
                </a>
              )}
            </div>

            {nextEpisode ? (
              <Link to={`/watch-episode/${nextEpisode.id}`}>
                <Button className="gap-2">
                  Next: E{nextEpisode.episode_number}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Episode List */}
          {allEpisodes.length > 1 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">All Episodes in Season {season?.season_number}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {allEpisodes.map((ep) => (
                  <Link
                    key={ep.id}
                    to={`/watch-episode/${ep.id}`}
                    className={`p-3 rounded-lg border transition-colors ${
                      ep.id === id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card hover:bg-secondary/50'
                    }`}
                  >
                    <span className="font-medium">Episode {ep.episode_number}</span>
                    <p className="text-xs text-muted-foreground truncate mt-1">{ep.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default WatchEpisode;
