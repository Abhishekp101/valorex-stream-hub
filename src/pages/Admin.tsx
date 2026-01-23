import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Film, FileText, Package, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import MovieAdmin from '@/components/admin/MovieAdmin';
import BlogAdmin from '@/components/admin/BlogAdmin';
import SoftwareAdmin from '@/components/admin/SoftwareAdmin';
import { Button } from '@/components/ui/button';

type AdminTab = 'movies' | 'blog' | 'software';

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <Film className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <span className="text-sm text-amber-500 font-medium">
                Not Admin
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1 mb-8 w-fit rounded-lg bg-secondary">
          <button
            onClick={() => setActiveTab('movies')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'movies'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Film className="w-4 h-4" />
            Movies
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'blog'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" />
            Blog
          </button>
          <button
            onClick={() => setActiveTab('software')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
              activeTab === 'software'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Package className="w-4 h-4" />
            Software
          </button>
        </div>

        {/* Content */}
        {activeTab === 'movies' && <MovieAdmin />}
        {activeTab === 'blog' && <BlogAdmin />}
        {activeTab === 'software' && <SoftwareAdmin />}
      </main>
    </div>
  );
};

export default Admin;
