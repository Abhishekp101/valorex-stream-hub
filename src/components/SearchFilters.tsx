import { Search } from 'lucide-react';
import { CategoryFilter, LanguageFilter } from '@/types/movie';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  languageFilter: LanguageFilter;
  onLanguageChange: (language: LanguageFilter) => void;
}

const SearchFilters = ({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  languageFilter,
  onLanguageChange,
}: SearchFiltersProps) => {
  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'hollywood', label: 'Hollywood' },
    { value: 'bollywood', label: 'Bollywood' },
  ];

  const languages: { value: LanguageFilter; label: string }[] = [
    { value: 'all', label: 'All Languages' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'dual', label: 'Dual Audio' },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                categoryFilter === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Language Select */}
        <select
          value={languageFilter}
          onChange={(e) => onLanguageChange(e.target.value as LanguageFilter)}
          className="px-4 py-2.5 text-sm font-medium rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchFilters;
