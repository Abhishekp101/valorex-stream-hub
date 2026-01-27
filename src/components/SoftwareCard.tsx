import { motion } from 'framer-motion';
import { Monitor, Apple, Smartphone, Gamepad2, Star, Download, Sparkles } from 'lucide-react';
import { PlatformType } from '@/types/software';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SoftwareCardProps {
  item: {
    id: string;
    name: string;
    description: string | null;
    version: string | null;
    platform: PlatformType;
    category: string | null;
    icon_url: string | null;
    download_count: number | null;
    reputation: number | null;
  };
  index: number;
  onClick: () => void;
}

const platformIcons: Record<PlatformType, React.ReactNode> = {
  windows: <Monitor className="w-6 h-6" />,
  mac: <Apple className="w-6 h-6" />,
  android_apps: <Smartphone className="w-6 h-6" />,
  android_games: <Gamepad2 className="w-6 h-6" />,
  pc_games: <Gamepad2 className="w-6 h-6" />,
};

const formatDownloadCount = (count: number) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
};

const SoftwareCard = ({ item, index, onClick }: SoftwareCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-3 h-3",
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'
        )}
      />
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-valorex-hover"
    >
      {/* Luxury Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      {/* Content */}
      <div className="relative p-5 flex items-center gap-4">
        {/* Icon with Luxury Border */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary border-2 border-border group-hover:border-primary/30 transition-colors shadow-lg">
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
          {/* Sparkle Accent */}
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-lg truncate group-hover:text-primary transition-colors">
            {item.name}
            {item.version && (
              <span className="text-muted-foreground font-normal text-sm ml-2">{item.version}</span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground truncate mt-1">
            {item.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {item.category && (
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                {item.category}
              </Badge>
            )}
            <div className="flex items-center gap-0.5">
              {renderStars(item.reputation || 4)}
            </div>
          </div>
        </div>

        {/* Stats & Arrow */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Download className="w-4 h-4" />
              <span className="font-semibold text-foreground">
                {item.download_count ? formatDownloadCount(item.download_count) : '0'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">Downloads</span>
          </div>

          {/* Arrow Indicator */}
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SoftwareCard;
