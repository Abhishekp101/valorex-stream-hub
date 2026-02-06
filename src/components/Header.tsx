import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Menu, FileText, Package } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';
import SearchPopup from './SearchPopup';
import UserMenu from './UserMenu';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  const menuItems = [
    { to: '/blog', icon: FileText, label: 'Blog' },
    { to: '/software', icon: Package, label: 'Software' },
  ];

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <AnimatedLogo />
          </Link>

          {/* Right Side Actions */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {/* Search Icon */}
            <motion.button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                </motion.button>
              </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.to;
                  return (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link
                        to={item.to}
                        className={cn(
                          "flex items-center gap-3 cursor-pointer",
                          isActive && "text-primary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <UserMenu />
          </nav>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-16" />

      {/* Search Popup */}
      <SearchPopup isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Header;
