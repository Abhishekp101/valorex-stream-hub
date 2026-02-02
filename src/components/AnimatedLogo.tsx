import { motion } from 'framer-motion';

const AnimatedLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <motion.div 
        className="relative flex items-center justify-center w-10 h-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated V Logo */}
        <svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background glow */}
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            className="fill-primary/20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* V shape with gradient */}
          <defs>
            <linearGradient id="vGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          
          {/* Animated V */}
          <motion.path
            d="M10 12L20 30L30 12"
            stroke="url(#vGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
          
          {/* Sparkle effect */}
          <motion.circle
            cx="20"
            cy="10"
            r="2"
            className="fill-primary"
            animate={{
              y: [0, -3, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0.5,
            }}
          />
        </svg>
      </motion.div>
      
      <motion.span 
        className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
        whileHover={{ scale: 1.02 }}
      >
        Valorex
      </motion.span>
    </div>
  );
};

export default AnimatedLogo;
