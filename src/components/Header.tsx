import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Settings, FileText, Package, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  
  const navLinks = [
    { to: '/', icon: Film, label: 'Movies' },
    { to: '/blog', icon: FileText, label: 'Blog' },
    { to: '/software', icon: Package, label: 'Software' },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full glass-premium"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div 
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Film className="w-5 h-5 text-primary-foreground" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3 text-primary-foreground/80 absolute -top-1 -right-1" />
            </motion.div>
          </motion.div>
          <motion.span 
            className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-3d"
            whileHover={{ scale: 1.05 }}
          >
            Valorex
          </motion.span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.to;
            return (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.to}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive 
                      ? "bg-primary/10 text-primary neon-glow" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <link.icon className="w-4 h-4" />
                  </motion.div>
                  <span className="hidden sm:inline">{link.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5 -z-10"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/admin"
              className="flex items-center gap-2 px-3 py-2 ml-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity shine-effect"
            >
              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </motion.div>
          <motion.div 
            className="ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ThemeToggle />
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
