import { ThemeConfig } from './schema';

/**
 * Default theme
 */
export const defaultTheme: ThemeConfig = {
  id: 'default',
  name: 'Nexus Default',
  description: 'Default theme for Nexus applications',
  version: '1.0.0',
  
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    secondary: '#10b981',
    secondaryLight: '#34d399',
    secondaryDark: '#059669',
    accent: '#8b5cf6',
    
    background: '#ffffff',
    foreground: '#030712',
    card: '#ffffff',
    cardForeground: '#030712',
    popover: '#ffffff',
    popoverForeground: '#030712',
    
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    
    text: '#030712',
    textMuted: '#6b7280',
    textDisabled: '#d1d5db',
    
    border: '#e5e7eb',
    inputBorder: '#d1d5db',
    
    buttonText: '#ffffff',
    buttonBackground: '#3b82f6',
    buttonHover: '#2563eb',
  },
  
  fonts: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headingFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    baseSize: '16px',
    lineHeight: 1.5,
  },
  
  spacing: {
    base: 4,
    unit: 'px',
    scale: {
      '0': 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '8': 8,
      '10': 10,
      '12': 12,
      '16': 16,
      '20': 20,
      '24': 24,
      '32': 32,
      '40': 40,
      '48': 48,
      '56': 56,
      '64': 64,
      '80': 80,
      '96': 96,
      '128': 128,
    },
    borderRadius: {
      small: '2px',
      medium: '4px',
      large: '8px',
      full: '9999px',
    },
  },
  
  assets: {
    logo: {
      default: '/assets/logo.svg',
      small: '/assets/logo-small.svg',
      dark: '/assets/logo-dark.svg',
    },
    favicon: '/favicon.ico',
  },
  
  features: {
    darkMode: true,
    themeSwitcher: true,
    customAccentColor: false,
  },
  
  seo: {
    title: 'Nexus Platform',
    description: 'Unified mobility platform for fleets, carshare, and autonomous vehicles',
    keywords: ['mobility', 'carshare', 'fleet', 'autonomous'],
  },
};

/**
 * Carshare theme
 */
export const carshareTheme: ThemeConfig = {
  id: 'carshare',
  name: 'Nexus Carshare',
  description: 'Theme for Nexus Carshare application',
  version: '1.0.0',
  
  colors: {
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#059669',
    secondaryLight: '#10b981',
    secondaryDark: '#047857',
    accent: '#7c3aed',
    
    background: '#ffffff',
    foreground: '#030712',
    card: '#ffffff',
    cardForeground: '#030712',
    
    success: '#16a34a',
    warning: '#d97706',
    error: '#dc2626',
    info: '#0284c7',
  },
  
  fonts: {
    family: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headingFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  assets: {
    logo: {
      default: '/assets/carshare/logo.svg',
      small: '/assets/carshare/logo-small.svg',
      dark: '/assets/carshare/logo-dark.svg',
    },
    favicon: '/assets/carshare/favicon.ico',
    backgroundImage: '/assets/carshare/hero-background.jpg',
    authPageBackground: '/assets/carshare/auth-background.jpg',
  },
  
  features: {
    darkMode: true,
    themeSwitcher: false,
  },
  
  seo: {
    title: 'Nexus Carshare',
    description: 'Rent cars from local hosts or share your own vehicle',
    keywords: ['carshare', 'car rental', 'peer-to-peer'],
  },
};

/**
 * Fleet theme
 */
export const fleetTheme: ThemeConfig = {
  id: 'fleet',
  name: 'Nexus Fleet',
  description: 'Theme for Nexus Fleet management application',
  version: '1.0.0',
  
  colors: {
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    primaryDark: '#1e3a8a',
    secondary: '#0f766e',
    secondaryLight: '#14b8a6',
    secondaryDark: '#115e59',
    accent: '#5b21b6',
    
    background: '#f8fafc',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    
    success: '#15803d',
    warning: '#b45309',
    error: '#b91c1c',
    info: '#0369a1',
  },
  
  fonts: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    headingFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  assets: {
    logo: {
      default: '/assets/fleet/logo.svg',
      small: '/assets/fleet/logo-small.svg',
      dark: '/assets/fleet/logo-dark.svg',
    },
    favicon: '/assets/fleet/favicon.ico',
  },
  
  features: {
    darkMode: true,
    themeSwitcher: true,
  },
  
  seo: {
    title: 'Nexus Fleet',
    description: 'Enterprise fleet management solutions',
    keywords: ['fleet', 'management', 'enterprise', 'business'],
  },
};

/**
 * Robotaxi theme
 */
export const robotaxiTheme: ThemeConfig = {
  id: 'robotaxi',
  name: 'Nexus Robotaxi',
  description: 'Theme for Nexus Robotaxi application',
  version: '1.0.0',
  
  colors: {
    primary: '#6d28d9',
    primaryLight: '#8b5cf6',
    primaryDark: '#5b21b6',
    secondary: '#0f766e',
    secondaryLight: '#14b8a6',
    secondaryDark: '#0f766e',
    accent: '#c026d3',
    
    background: '#ffffff',
    foreground: '#18181b',
    card: '#ffffff',
    cardForeground: '#18181b',
    
    success: '#15803d',
    warning: '#a16207',
    error: '#b91c1c',
    info: '#0ea5e9',
  },
  
  fonts: {
    family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    headingFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  },
  
  assets: {
    logo: {
      default: '/assets/robotaxi/logo.svg',
      small: '/assets/robotaxi/logo-small.svg',
      dark: '/assets/robotaxi/logo-dark.svg',
    },
    favicon: '/assets/robotaxi/favicon.ico',
    loader: '/assets/robotaxi/loader.svg',
  },
  
  features: {
    darkMode: true,
    themeSwitcher: true,
  },
  
  seo: {
    title: 'Nexus Robotaxi',
    description: 'Autonomous vehicle ride hailing',
    keywords: ['robotaxi', 'autonomous', 'self-driving', 'ride-hailing'],
  },
};

/**
 * All themes
 */
export const themes: Record<string, ThemeConfig> = {
  default: defaultTheme,
  carshare: carshareTheme,
  fleet: fleetTheme,
  robotaxi: robotaxiTheme,
};