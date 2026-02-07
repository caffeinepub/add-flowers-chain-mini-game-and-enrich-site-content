import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useThemePreference() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('breeze-theme');
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('breeze-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, setTheme, toggleTheme };
}
