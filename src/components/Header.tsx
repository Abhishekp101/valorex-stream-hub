import { Link } from 'react-router-dom';
import { Film, Settings, FileText, Package } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Valorex</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <Link
            to="/blog"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Blog</span>
          </Link>
          <Link
            to="/software"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
          >
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Software</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-accent transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
