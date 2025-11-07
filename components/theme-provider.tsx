'use client';

import { useEffect } from 'react';

export function ThemeProvider() {
  useEffect(() => {
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    // Function to update theme
    const updateTheme = (isDark: boolean) => {
      const theme = isDark ? 'timeline-dark' : 'timeline';
      document.documentElement.setAttribute('data-theme', theme);
    };

    // Set initial theme
    updateTheme(darkModeMediaQuery.matches);

    // Listen for changes in system preference
    const handleChange = (e: MediaQueryListEvent) => {
      updateTheme(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return null;
}
