import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, ChevronDown, ChevronRight, Film, Tv } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const WebSeriesAdmin = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);

  // Form states
  const [seriesForm, setSeriesForm] = useState({
    title: '',
    poster_url: '',
    release_date: '',
    category: 'hollywood',
    language: 'dual',
    info: '',
  });

  const [seasonForm, setSeasonForm] = useState({ seriesId: '', seasonNumber: 1, title: '' });
  const [episodeForm, setEpisodeForm] = useState({
    seasonId: '',
    episodeNumber: 1,
    title: '',
    videoLink: '',
    downloadLink: '',
    duration: '',
  });

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    setLoading(true);
    const { data: seriesData, error } = await supabase
      .from('web_series')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch series', variant: 'destructive' });
      setLoading(false);
      return;
    }

    // Fetch seasons and episodes for each series
    const fullSeries: Series[] = await Promise.all(
      (seriesData || []).map(async (s) => {
        const { data: seasonsData } = await supabase
          .from('seasons')
          .select('*')
          .eq('series_id', s.id)
          .order('season_number');

        const seasons: Season[] = await Promise.all(
          (seasonsData || []).map(async (season) => {
            const { data: episodesData } = await supabase
              .from('episodes')
              .select('*')
              .eq('season_id', season.id)
              .order('episode_number');

            return {
              ...season,
              episodes: episodesData || [],
            };
          })
        );

        return { ...s, seasons };
      })
    );

    setSeries(fullSeries);
    setLoading(false);
  };

  const handleAddSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seriesForm.title || !seriesForm.poster_url) {
      toast({ title: 'Error', description: 'Title and poster are required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from('web_series').insert({
      title: seriesForm.title,
      poster_url: seriesForm.poster_url,
      release_date: seriesForm.release_date,
      category: seriesForm.category,
      language: seriesForm.language,
      info: seriesForm.info,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Web series added!' });
      setSeriesForm({ title: '', poster_url: '', release_date: '', category: 'hollywood', language: 'dual', info: '' });
      fetchSeries();
    }
    setIsSubmitting(false);
  };

  const handleAddSeason = async (seriesId: string) => {
    if (!seasonForm.title) {
      toast({ title: 'Error', description: 'Season title is required', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('seasons').insert({
      series_id: seriesId,
      season_number: seasonForm.seasonNumber,
      title: seasonForm.title,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Season added!' });
      setSeasonForm({ seriesId: '', seasonNumber: 1, title: '' });
      fetchSeries();
    }
  };

  const handleAddEpisode = async (seasonId: string) => {
    if (!episodeForm.title) {
      toast({ title: 'Error', description: 'Episode title is required', variant: 'destructive' });
      return;
    }

    const { error } = await supabase.from('episodes').insert({
      season_id: seasonId,
      episode_number: episodeForm.episodeNumber,
      title: episodeForm.title,
      video_link: episodeForm.videoLink || null,
      download_link: episodeForm.downloadLink || null,
      duration: episodeForm.duration || null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Episode added!' });
      setEpisodeForm({ seasonId: '', episodeNumber: 1, title: '', videoLink: '', downloadLink: '', duration: '' });
      fetchSeries();
    }
  };

  const handleDeleteSeries = async (id: string) => {
    const { error } = await supabase.from('web_series').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Series deleted' });
      fetchSeries();
    }
  };

  const handleDeleteSeason = async (id: string) => {
    const { error } = await supabase.from('seasons').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Season deleted' });
      fetchSeries();
    }
  };

  const handleDeleteEpisode = async (id: string) => {
    const { error } = await supabase.from('episodes').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Deleted', description: 'Episode deleted' });
      fetchSeries();
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Add Series Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
          <Tv className="w-5 h-5" />
          Add New Web Series
        </h2>

        <form onSubmit={handleAddSeries} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Title *</label>
              <Input
                value={seriesForm.title}
                onChange={(e) => setSeriesForm({ ...seriesForm, title: e.target.value })}
                placeholder="Series title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Poster URL *</label>
              <Input
                value={seriesForm.poster_url}
                onChange={(e) => setSeriesForm({ ...seriesForm, poster_url: e.target.value })}
                placeholder="https://..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Release Date</label>
              <Input
                value={seriesForm.release_date}
                onChange={(e) => setSeriesForm({ ...seriesForm, release_date: e.target.value })}
                placeholder="2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Category</label>
              <Select value={seriesForm.category} onValueChange={(v) => setSeriesForm({ ...seriesForm, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hollywood">Hollywood</SelectItem>
                  <SelectItem value="bollywood">Bollywood</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Language</label>
              <Select value={seriesForm.language} onValueChange={(v) => setSeriesForm({ ...seriesForm, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="dual">Dual Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <Textarea
              value={seriesForm.info}
              onChange={(e) => setSeriesForm({ ...seriesForm, info: e.target.value })}
              placeholder="About the series..."
              rows={2}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Web Series
          </Button>
        </form>
      </motion.section>

      {/* Series List */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl border border-border bg-card"
      >
        <h2 className="font-display text-xl font-semibold mb-6">All Web Series ({series.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : series.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No web series added yet.</p>
        ) : (
          <div className="space-y-4">
            {series.map((s) => (
              <div key={s.id} className="border border-border rounded-lg overflow-hidden">
                {/* Series Header */}
                <div
                  className="flex items-center gap-4 p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setExpandedSeries(expandedSeries === s.id ? null : s.id)}
                >
                  {expandedSeries === s.id ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                  <img src={s.poster_url || ''} alt={s.title} className="w-20 aspect-video object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.seasons.length} Season{s.seasons.length !== 1 ? 's' : ''} • {s.category} • {s.language}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => { e.stopPropagation(); handleDeleteSeries(s.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {expandedSeries === s.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        {/* Add Season */}
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="text-xs font-medium">Season #</label>
                            <Input
                              type="number"
                              min={1}
                              value={seasonForm.seriesId === s.id ? seasonForm.seasonNumber : s.seasons.length + 1}
                              onChange={(e) => setSeasonForm({ ...seasonForm, seriesId: s.id, seasonNumber: parseInt(e.target.value) })}
                              className="h-9"
                            />
                          </div>
                          <div className="flex-[2]">
                            <label className="text-xs font-medium">Season Title</label>
                            <Input
                              value={seasonForm.seriesId === s.id ? seasonForm.title : ''}
                              onChange={(e) => setSeasonForm({ ...seasonForm, seriesId: s.id, title: e.target.value })}
                              placeholder="Season 1"
                              className="h-9"
                            />
                          </div>
                          <Button size="sm" onClick={() => handleAddSeason(s.id)}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Seasons */}
                        {s.seasons.map((season) => (
                          <div key={season.id} className="ml-4 border-l-2 border-border pl-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">
                                Season {season.season_number}: {season.title || 'Untitled'}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive h-7"
                                onClick={() => handleDeleteSeason(season.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Add Episode */}
                            <div className="flex gap-2 items-end mb-3">
                              <div className="w-16">
                                <label className="text-xs">Ep #</label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={episodeForm.seasonId === season.id ? episodeForm.episodeNumber : season.episodes.length + 1}
                                  onChange={(e) => setEpisodeForm({ ...episodeForm, seasonId: season.id, episodeNumber: parseInt(e.target.value) })}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs">Title</label>
                                <Input
                                  value={episodeForm.seasonId === season.id ? episodeForm.title : ''}
                                  onChange={(e) => setEpisodeForm({ ...episodeForm, seasonId: season.id, title: e.target.value })}
                                  placeholder="Episode title"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs">Video Link</label>
                                <Input
                                  value={episodeForm.seasonId === season.id ? episodeForm.videoLink : ''}
                                  onChange={(e) => setEpisodeForm({ ...episodeForm, seasonId: season.id, videoLink: e.target.value })}
                                  placeholder="GDrive link"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs">Download</label>
                                <Input
                                  value={episodeForm.seasonId === season.id ? episodeForm.downloadLink : ''}
                                  onChange={(e) => setEpisodeForm({ ...episodeForm, seasonId: season.id, downloadLink: e.target.value })}
                                  placeholder="Download link"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <Button size="sm" className="h-8" onClick={() => handleAddEpisode(season.id)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* Episodes List */}
                            {season.episodes.length > 0 && (
                              <div className="space-y-1">
                                {season.episodes.map((ep) => (
                                  <div key={ep.id} className="flex items-center justify-between py-2 px-3 bg-secondary/30 rounded text-sm">
                                    <span>
                                      <strong>E{ep.episode_number}:</strong> {ep.title}
                                      {ep.duration && <span className="text-muted-foreground ml-2">({ep.duration})</span>}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {ep.video_link && <span className="text-xs text-green-500">▶ Stream</span>}
                                      {ep.download_link && <span className="text-xs text-blue-500">↓ Download</span>}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive h-6 px-2"
                                        onClick={() => handleDeleteEpisode(ep.id)}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default WebSeriesAdmin;
