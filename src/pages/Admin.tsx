import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Film, FileText } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import MovieAdmin from '@/components/admin/MovieAdmin';
import BlogAdmin from '@/components/admin/BlogAdmin';

type AdminTab = 'movies' | 'blog';

const Admin = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('movies');

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
          <ThemeToggle />
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
            Movie Admin
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
            Blog Admin
          </button>
        </div>

        {/* Content */}
        {activeTab === 'movies' ? <MovieAdmin /> : <BlogAdmin />}
      </main>
    </div>
  );
};

export default Admin;
