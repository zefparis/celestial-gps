import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const handleChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 bg-bg-surface rounded-lg p-1">
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => handleChange(lang)}
          className={cn(
            'px-3 py-1 rounded text-sm font-mono uppercase transition-all',
            language === lang
              ? 'bg-accent-primary text-bg-deep'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
