import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Package, Star, Sparkles, Monitor, Apple, Smartphone, Gamepad2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import ShareButtons from '@/components/ShareButtons';
import SoftwareCard from '@/components/SoftwareCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformType, platformLabels } from '@/types/software';

interface SoftwareGame {
  id: string;
  name: string;
  description: string | null;
  version: string | null;
  platform: PlatformType;
  category: string | null;
  icon_url: string | null;
  download_count: number | null;
  file_size: string | null;
  reputation: number | null;
  download_link: string | null;
  created_at: string;
}

const platformIcons: Record<PlatformType, React.ReactNode> = {
  windows: <Monitor className="w-6 h-6" />,
  mac: <Apple className="w-6 h-6" />,
  android_apps: <Smartphone className="w-6 h-6" />,
  android_games: <Gamepad2 className="w-6 h-6" />,
  pc_games: <Gamepad2 className="w-6 h-6" />,
};

const SoftwareDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [software, setSoftware] = useState<SoftwareGame | null>(null);
  const [relatedItems, setRelatedItems] = useState<SoftwareGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSoftware = async () => {
      if (!id) return;

      setLoading(true);

      const { data: softwareData, error } = await supabase
        .from('software_games')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && softwareData) {
        setSoftware(softwareData as SoftwareGame);

        // Fetch related items (same platform, excluding current)
        const { data: relatedData } = await supabase
          .from('software_games')
          .select('*')
          .eq('platform', softwareData.platform)
          .neq('id', id)
          .limit(4);

        if (relatedData) {
          setRelatedItems(relatedData as SoftwareGame[]);
        }
      }

      setLoading(false);
    };

    fetchSoftware();
    window.scrollTo(0, 0);
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
      />
    ));
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="grid lg:grid-cols-[300px_1fr] gap-10">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-14 w-48" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!software) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Software Not Found</h1>
            <p className="text-muted-foreground mb-8">The software you're looking for doesn't exist or has been removed.</p>
            <Link to="/software">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Software
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Luxury Background Effect */}
      <div className="absolute inset-x-0 top-16 h-96 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <main className="container py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/software"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Software
          </Link>
        </motion.div>

        {/* Software Details */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-10 mb-16">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            {/* Luxury Glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-50" />
            
            <div className="relative aspect-square rounded-3xl overflow-hidden border-2 border-border bg-card shadow-valorex-hover">
              {software.icon_url ? (
                <img
                  src={software.icon_url}
                  alt={software.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  {platformIcons[software.platform]}
                </div>
              )}
            </div>

            {/* Platform Badge */}
            <div className="absolute -top-3 -right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm shadow-lg flex items-center gap-2">
              {platformIcons[software.platform]}
              <span className="hidden sm:inline">{platformLabels[software.platform]}</span>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title & Version */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {software.category || 'Software'}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {software.name}
              </h1>
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {software.version && (
                  <Badge variant="secondary" className="text-sm px-4 py-1.5">
                    Version {software.version}
                  </Badge>
                )}
                {software.file_size && (
                  <Badge variant="outline" className="text-sm px-4 py-1.5">
                    {software.file_size}
                  </Badge>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  <span className="font-semibold text-foreground">
                    {software.download_count ? formatDownloadCount(software.download_count) : '0'}
                  </span>
                  <span>Downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(software.reputation || 4)}
                  <span className="ml-2 font-semibold text-foreground">
                    {software.reputation || 4}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {software.description && (
              <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  About
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {software.description}
                </p>
              </div>
            )}

            {/* Download Button */}
            <div className="flex flex-wrap gap-4">
              {software.download_link ? (
                <a
                  href={software.download_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-3 text-lg h-14 px-10 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50">
                    <Download className="w-5 h-5" />
                    Download Now
                    {software.file_size && (
                      <span className="text-primary-foreground/70">({software.file_size})</span>
                    )}
                  </Button>
                </a>
              ) : (
                <Button size="lg" disabled className="gap-3 text-lg h-14 px-10">
                  <Download className="w-5 h-5" />
                  Download Unavailable
                </Button>
              )}
            </div>

            {/* Share Buttons */}
            <div className="pt-6 border-t border-border">
              <ShareButtons title={`Download ${software.name} - Valorex`} />
            </div>
          </motion.div>
        </div>

        {/* Related Software */}
        {relatedItems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
              <h2 className="font-display text-2xl font-bold">Related {platformLabels[software.platform]}</h2>
            </div>
            <div className="space-y-4">
              {relatedItems.map((item, index) => (
                <Link to={`/software/${item.id}`} key={item.id}>
                  <SoftwareCard
                    item={item}
                    index={index}
                    onClick={() => {}}
                  />
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default SoftwareDetails;
