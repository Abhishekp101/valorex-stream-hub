import { motion } from 'framer-motion';
import { CategoryFilter, LanguageFilter } from '@/types/movie';

interface NetflixFiltersProps {
  categoryFilter: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  languageFilter: LanguageFilter;
  onLanguageChange: (language: LanguageFilter) => void;
}

const NetflixFilters = ({
  categoryFilter,
  onCategoryChange,
  languageFilter,
  onLanguageChange,
}: NetflixFiltersProps) => {
  const categories: { value: CategoryFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'hollywood', label: 'Hollywood' },
    { value: 'bollywood', label: 'Bollywood' },
  ];

  const languages: { value: LanguageFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'dual', label: 'Dual Audio' },
  ];

  return (
    <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
      {/* Category Tabs */}
      <div className="flex items-center gap-1">
        {categories.map((cat) => (
          <motion.button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`relative px-5 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
              categoryFilter === cat.value
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {categoryFilter === cat.value && (
              <motion.div
                layoutId="activeCategoryBg"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border" />

      {/* Language Pills */}
      <div className="flex items-center gap-2">
        {languages.map((lang) => (
          <motion.button
            key={lang.value}
            onClick={() => onLanguageChange(lang.value)}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all whitespace-nowrap ${
              languageFilter === lang.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {lang.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default NetflixFilters;
