import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface VideoPlayerProps {
  embedUrl: string;
  title: string;
  posterUrl?: string;
}

const VideoPlayer = ({ embedUrl, title, posterUrl }: VideoPlayerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden border border-border bg-black shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-foreground animate-spin" />
              <p className="text-foreground/70 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Video iframe */}
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          title={`Watch ${title}`}
          onLoad={handleIframeLoad}
        />

        {/* Control Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          {/* Top Gradient */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
          
          {/* Bottom Gradient with Controls */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
          
          {/* Title at top */}
          <div className="absolute top-0 left-0 right-0 p-4 md:p-6 pointer-events-auto">
            <h3 className="text-white font-display font-bold text-lg md:text-xl truncate">
              {title}
            </h3>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-auto">
            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {/* Skip buttons - visual only since we can't control iframe */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10"
                  title="Rewind 10s (use player controls)"
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10"
                  title="Forward 10s (use player controls)"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 h-10 w-10"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Player Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                      Playback Speed
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">0.5x</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">0.75x</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer bg-secondary">1x (Normal)</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">1.25x</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">1.5x</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">2x</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                      Quality
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">Auto</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">1080p HD</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">720p</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">480p</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">360p</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Fullscreen Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-10 w-10"
                  onClick={handleFullscreen}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
          Press <kbd className="bg-white/20 px-1.5 py-0.5 rounded">F</kbd> for fullscreen
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
