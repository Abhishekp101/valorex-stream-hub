import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import SoftwareCard from '@/components/SoftwareCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Monitor, Apple, Smartphone, Gamepad2, Sparkles } from 'lucide-react';
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
  const navigate = useNavigate();
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

  const handleItemClick = (id: string) => {
    navigate(`/software/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Luxury Background Effect */}
      <div className="absolute inset-x-0 top-16 h-80 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <main className="container py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <Sparkles className="w-4 h-4" />
            Premium Downloads
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Software & <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">Games</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Download the latest premium software, apps, and games for all your devices
          </p>
        </motion.section>

        {/* Platform Tabs */}
        <Tabs value={activePlatform} onValueChange={(v) => setActivePlatform(v as PlatformType)}>
          <TabsList className="grid w-full grid-cols-5 mb-8 h-14 p-1.5 bg-secondary/50 backdrop-blur-sm border border-border">
            {(Object.keys(platformLabels) as PlatformType[]).map((platform) => (
              <TabsTrigger
                key={platform}
                value={platform}
                className="flex items-center gap-2 h-full data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all"
              >
                {platformIcons[platform]}
                <span className="hidden sm:inline font-medium">{platformLabels[platform]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {(Object.keys(platformLabels) as PlatformType[]).map((platform) => (
            <TabsContent key={platform} value={platform}>
              {/* Category Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent" />
                <h2 className="font-display text-2xl font-bold">
                  {platformLabels[platform]}
                </h2>
              </motion.div>

              {/* Items List */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card">
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <SoftwareCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                    {platformIcons[platform]}
                  </div>
                  <p className="text-muted-foreground text-lg">
                    No {platformLabels[platform].toLowerCase()} available yet
                  </p>
                </motion.div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
};

export default Software;
