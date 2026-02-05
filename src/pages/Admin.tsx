import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Film, FileText, Package, LogOut, Loader2, Layers, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import MovieAdmin from '@/components/admin/MovieAdmin';
import BlogAdmin from '@/components/admin/BlogAdmin';
import SoftwareAdmin from '@/components/admin/SoftwareAdmin';
import SliderAdmin from '@/components/admin/SliderAdmin';
import MovieRequestsAdmin from '@/components/admin/MovieRequestsAdmin';
import UsersAdmin from '@/components/admin/UsersAdmin';
import { Button } from '@/components/ui/button';

type AdminTab = 'movies' | 'slider' | 'blog' | 'software' | 'requests' | 'users';

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('movies');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'movies' as const, label: 'Movies', icon: Film },
    { id: 'slider' as const, label: 'Slider', icon: Layers },
    { id: 'requests' as const, label: 'Requests', icon: MessageSquare },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'blog' as const, label: 'Blog', icon: FileText },
    { id: 'software' as const, label: 'Software', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="px-4 sm:px-6 md:px-8 flex h-14 sm:h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/"
              className="flex items-center gap-1 sm:gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg sm:text-xl font-bold">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {!isAdmin && (
              <span className="text-xs sm:text-sm text-amber-500 font-medium">
                Not Admin
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={signOut} className="px-2 sm:px-3">
              <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 p-1 mb-6 sm:mb-8 w-full sm:w-fit rounded-lg bg-secondary overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden xs:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'movies' && <MovieAdmin />}
        {activeTab === 'slider' && <SliderAdmin />}
        {activeTab === 'requests' && <MovieRequestsAdmin />}
        {activeTab === 'users' && <UsersAdmin />}
        {activeTab === 'blog' && <BlogAdmin />}
        {activeTab === 'software' && <SoftwareAdmin />}
      </main>
    </div>
  );
};

export default Admin;
