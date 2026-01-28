import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import SoftwareCard from '@/components/SoftwareCard';
import SoftwareSearchFilters from '@/components/SoftwareSearchFilters';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
    setSearchQuery('');
    setCategoryFilter('all');
  }, [activePlatform]);

  // Get unique categories from items
  const categories = useMemo(() => {
    const cats = items.map((item) => item.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  const handleItemClick = (id: string) => {
    navigate(`/software/${id}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Luxury Background Effect with Floating Elements */}
      <div className="absolute inset-x-0 top-16 h-[500px] overflow-hidden -z-10">
        <div className="absolute inset-0 morph-bg" />
        
        {/* Floating 3D Orbs */}
        <motion.div 
          className="absolute top-20 left-[10%] w-80 h-80 rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-[10%] w-96 h-96 rounded-full bg-gradient-to-bl from-accent/10 to-transparent blur-3xl"
          animate={{ 
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <main className="container py-8 relative">
        {/* Hero Section with 3D Effects */}
        <motion.section
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 perspective-container"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20 backdrop-blur-sm"
            animate={{ boxShadow: ["0 0 20px hsl(var(--primary) / 0.3)", "0 0 40px hsl(var(--primary) / 0.5)", "0 0 20px hsl(var(--primary) / 0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 animate-bounce-subtle" />
            Premium Downloads
          </motion.div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-4 text-3d-deep">
            Software &{' '}
            <motion.span 
              className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[size:200%_100%]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Games
            </motion.span>
          </h1>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Download the latest premium software, apps, and games for all your devices
          </motion.p>
        </motion.section>

        {/* Platform Tabs */}
        <Tabs value={activePlatform} onValueChange={(v) => setActivePlatform(v as PlatformType)}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-5 mb-8 h-14 p-1.5 glass-premium rounded-xl">
              {(Object.keys(platformLabels) as PlatformType[]).map((platform, index) => (
                <motion.div
                  key={platform}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <TabsTrigger
                    value={platform}
                    className="flex items-center gap-2 w-full h-full rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all data-[state=active]:neon-glow"
                  >
                    <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                      {platformIcons[platform]}
                    </motion.div>
                    <span className="hidden sm:inline font-medium">{platformLabels[platform]}</span>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>
          </motion.div>

          {(Object.keys(platformLabels) as PlatformType[]).map((platform) => (
            <TabsContent key={platform} value={platform}>
              {/* Search & Filter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <SoftwareSearchFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  categoryFilter={categoryFilter}
                  onCategoryChange={setCategoryFilter}
                  categories={categories}
                />
              </motion.div>

              {/* Results Count */}
              <motion.div 
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-1.5 h-8 rounded-full bg-gradient-to-b from-primary to-accent"
                    animate={{ scaleY: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h2 className="font-display text-2xl font-bold text-3d">
                    {platformLabels[platform]}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground glass-premium px-4 py-2 rounded-full">
                  Showing <span className="font-semibold text-foreground mx-1">{filteredItems.length}</span> of <span className="font-semibold text-foreground mx-1">{items.length}</span> items
                </p>
              </motion.div>

              {/* Items List */}
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div 
                      key={i} 
                      className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card/50 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </motion.div>
                  ))}
                </div>
              ) : filteredItems.length > 0 ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {filteredItems.map((item, index) => (
                    <SoftwareCard
                      key={item.id}
                      item={item}
                      index={index}
                      onClick={() => handleItemClick(item.id)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6 neon-glow"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    {platformIcons[platform]}
                  </motion.div>
                  <p className="text-muted-foreground text-lg">
                    {searchQuery || categoryFilter !== 'all'
                      ? 'No items match your search criteria'
                      : `No ${platformLabels[platform].toLowerCase()} available yet`}
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
