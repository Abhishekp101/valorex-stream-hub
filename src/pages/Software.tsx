import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Monitor, 
  Apple, 
  Smartphone, 
  Gamepad2, 
  Download,
  Star,
  ExternalLink
} from 'lucide-react';
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
}

const platformIcons: Record<PlatformType, React.ReactNode> = {
  windows: <Monitor className="w-4 h-4" />,
  mac: <Apple className="w-4 h-4" />,
  android_apps: <Smartphone className="w-4 h-4" />,
  android_games: <Gamepad2 className="w-4 h-4" />,
  pc_games: <Gamepad2 className="w-4 h-4" />,
};

const Software = () => {
  const [items, setItems] = useState<SoftwareGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<PlatformType>('windows');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('software_games')
        .select('*')
        .eq('platform', activePlatform)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setItems(data as SoftwareGame[]);
      }
      setLoading(false);
    };

    fetchItems();
  }, [activePlatform]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'
        }`}
      />
    ));
  };

  const formatDownloadCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            All Platforms Supported
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Software & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Games</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Download the latest premium software, apps, and games for all your devices
          </p>
        </section>

        {/* Platform Tabs */}
        <Tabs value={activePlatform} onValueChange={(v) => setActivePlatform(v as PlatformType)}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {(Object.keys(platformLabels) as PlatformType[]).map((platform) => (
              <TabsTrigger 
                key={platform} 
                value={platform}
                className="flex items-center gap-2"
              >
                {platformIcons[platform]}
                <span className="hidden sm:inline">{platformLabels[platform]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(platformLabels) as PlatformType[]).map((platform) => (
            <TabsContent key={platform} value={platform}>
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-primary rounded-full" />
                  <h2 className="font-display text-2xl font-bold">
                    {platformLabels[platform]}
                  </h2>
                </div>
              </div>

              {/* Items List */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                      <Skeleton className="w-16 h-16 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-valorex transition-all duration-300"
                    >
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0 shadow-md">
                        {item.icon_url ? (
                          <img
                            src={item.icon_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary">
                            {platformIcons[item.platform]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {item.name} 
                          {item.version && (
                            <span className="text-muted-foreground font-normal text-sm ml-2">{item.version}</span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {item.category && (
                            <Badge variant="outline" className="text-primary border-primary/30">
                              {item.category}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-center">
                          <div className="flex items-center gap-1 mb-1">
                            <Download className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {item.download_count ? formatDownloadCount(item.download_count) : '0'}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">Downloads</span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-0.5 mb-1">
                            {renderStars(item.reputation || 4)}
                          </div>
                          <span className="text-xs text-muted-foreground">Rating</span>
                        </div>
                      </div>

                      {/* Size & Download */}
                      <div className="text-right flex-shrink-0 flex flex-col items-end gap-2">
                        {item.file_size && (
                          <span className="text-lg font-bold text-foreground">
                            {item.file_size}
                          </span>
                        )}
                        {item.download_link && (
                          <a
                            href={item.download_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                              <Download className="w-4 h-4" />
                              Get
                            </Button>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    No {platformLabels[platform].toLowerCase()} available yet
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Software;
