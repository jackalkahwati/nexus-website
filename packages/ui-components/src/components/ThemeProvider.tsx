import React from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  themeOverrides?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    brandName?: string;
    logoUrl?: string;
    fontFamily?: string;
  };
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeOverrides?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    brandName?: string;
    logoUrl?: string;
    fontFamily?: string;
  };
  applyThemeOverrides: (overrides: ThemeProviderProps['themeOverrides']) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  applyThemeOverrides: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'nexus-ui-theme',
  themeOverrides,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  
  const [overrides, setOverrides] = React.useState<ThemeProviderProps['themeOverrides']>(themeOverrides);

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  React.useEffect(() => {
    if (overrides) {
      const root = window.document.documentElement;
      
      // Apply CSS custom properties for theming
      if (overrides.primaryColor) {
        root.style.setProperty('--primary', overrides.primaryColor);
      }
      
      if (overrides.secondaryColor) {
        root.style.setProperty('--secondary', overrides.secondaryColor);
      }
      
      if (overrides.accentColor) {
        root.style.setProperty('--accent', overrides.accentColor);
      }
      
      if (overrides.fontFamily) {
        root.style.setProperty('--font-family', overrides.fontFamily);
      }
    }
  }, [overrides]);

  const applyThemeOverrides = React.useCallback((newOverrides: ThemeProviderProps['themeOverrides']) => {
    setOverrides(prev => ({ ...prev, ...newOverrides }));
  }, []);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (newTheme: Theme) => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      },
      themeOverrides: overrides,
      applyThemeOverrides,
    }),
    [theme, overrides, storageKey, applyThemeOverrides]
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = (): ThemeProviderState => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};