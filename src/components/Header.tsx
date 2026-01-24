import { Link, useLocation } from 'react-router-dom';
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
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <Film className="w-5 h-5 text-primary-foreground" />
            <Sparkles className="w-3 h-3 text-primary-foreground/80 absolute -top-1 -right-1" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Valorex
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 ml-2 text-sm font-medium rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
