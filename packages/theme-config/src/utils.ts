import { ThemeConfig, ThemeConfigSchema } from './schema';
import { defaultTheme, themes } from './themes';

/**
 * Validate a theme configuration
 */
export function validateTheme(theme: unknown): { valid: boolean; errors?: string[] } {
  try {
    ThemeConfigSchema.parse(theme);
    return { valid: true };
  } catch (error: any) {
    const errors = error.errors || [{ message: 'Invalid theme configuration' }];
    return {
      valid: false,
      errors: errors.map((err: any) => `${err.path.join('.')}: ${err.message}`),
    };
  }
}

/**
 * Get a theme by ID
 */
export function getTheme(themeId: string): ThemeConfig {
  return themes[themeId] || defaultTheme;
}

/**
 * Create CSS variables string from theme
 */
export function createCssVariables(theme: ThemeConfig): string {
  const variables: string[] = [];

  // Add color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables.push(`--color-${key}: ${value};`);
  });

  // Add font variables
  if (theme.fonts) {
    if (theme.fonts.family) {
      variables.push(`--font-family: ${theme.fonts.family};`);
    }
    if (theme.fonts.headingFamily) {
      variables.push(`--font-heading: ${theme.fonts.headingFamily};`);
    }
    if (theme.fonts.baseSize) {
      variables.push(`--font-size-base: ${theme.fonts.baseSize};`);
    }
    if (theme.fonts.lineHeight) {
      variables.push(`--line-height: ${theme.fonts.lineHeight};`);
    }
    if (theme.fonts.weights) {
      Object.entries(theme.fonts.weights).forEach(([key, value]) => {
        variables.push(`--font-weight-${key}: ${value};`);
      });
    }
  }

  // Add spacing variables
  if (theme.spacing) {
    if (theme.spacing.base) {
      variables.push(`--spacing-base: ${theme.spacing.base}${theme.spacing.unit || 'px'};`);
    }
    if (theme.spacing.scale) {
      Object.entries(theme.spacing.scale).forEach(([key, value]) => {
        variables.push(`--spacing-${key}: ${value}${theme.spacing?.unit || 'px'};`);
      });
    }
    if (theme.spacing.borderRadius) {
      Object.entries(theme.spacing.borderRadius).forEach(([key, value]) => {
        variables.push(`--radius-${key}: ${value};`);
      });
    }
  }

  // Add breakpoint variables
  if (theme.breakpoints) {
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      variables.push(`--breakpoint-${key}: ${value};`);
    });
  }

  return `:root {\n  ${variables.join('\n  ')}\n}`;
}

/**
 * Create theme object for tailwind config
 */
export function createTailwindTheme(theme: ThemeConfig): Record<string, any> {
  return {
    colors: {
      primary: {
        DEFAULT: theme.colors.primary,
        light: theme.colors.primaryLight,
        dark: theme.colors.primaryDark,
      },
      secondary: {
        DEFAULT: theme.colors.secondary,
        light: theme.colors.secondaryLight,
        dark: theme.colors.secondaryDark,
      },
      accent: {
        DEFAULT: theme.colors.accent || defaultTheme.colors.accent,
      },
      background: theme.colors.background || defaultTheme.colors.background,
      foreground: theme.colors.foreground || defaultTheme.colors.foreground,
      card: {
        DEFAULT: theme.colors.card || defaultTheme.colors.card,
        foreground: theme.colors.cardForeground || defaultTheme.colors.cardForeground,
      },
      popover: {
        DEFAULT: theme.colors.popover || defaultTheme.colors.popover,
        foreground: theme.colors.popoverForeground || defaultTheme.colors.popoverForeground,
      },
      success: theme.colors.success || defaultTheme.colors.success,
      warning: theme.colors.warning || defaultTheme.colors.warning,
      error: theme.colors.error || defaultTheme.colors.error,
      info: theme.colors.info || defaultTheme.colors.info,
      border: theme.colors.border || defaultTheme.colors.border,
    },
    fontFamily: {
      sans: [
        theme.fonts?.family?.split(',')[0] || 'Inter',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
      ],
      heading: [
        theme.fonts?.headingFamily?.split(',')[0] || theme.fonts?.family?.split(',')[0] || 'Inter',
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
      ],
    },
    borderRadius: {
      sm: theme.spacing?.borderRadius?.small || defaultTheme.spacing?.borderRadius?.small,
      md: theme.spacing?.borderRadius?.medium || defaultTheme.spacing?.borderRadius?.medium,
      lg: theme.spacing?.borderRadius?.large || defaultTheme.spacing?.borderRadius?.large,
      full: theme.spacing?.borderRadius?.full || defaultTheme.spacing?.borderRadius?.full,
    },
  };
}

/**
 * Merge themes with partial override
 */
export function mergeThemes(base: ThemeConfig, override: Partial<ThemeConfig>): ThemeConfig {
  // Deep merge logic for nested properties
  const merged = {
    ...base,
    ...override,
    colors: { ...base.colors, ...override.colors },
    fonts: { ...base.fonts, ...override.fonts },
    spacing: { ...base.spacing, ...override.spacing },
    breakpoints: { ...base.breakpoints, ...override.breakpoints },
    assets: { ...base.assets, ...override.assets },
    features: { ...base.features, ...override.features },
    seo: { ...base.seo, ...override.seo },
  };

  // Handle nested objects in fonts
  if (base.fonts?.weights || override.fonts?.weights) {
    merged.fonts = {
      ...merged.fonts,
      weights: { ...base.fonts?.weights, ...override.fonts?.weights },
    };
  }

  // Handle nested objects in spacing
  if (base.spacing?.scale || override.spacing?.scale) {
    merged.spacing = {
      ...merged.spacing,
      scale: { ...base.spacing?.scale, ...override.spacing?.scale },
    };
  }

  if (base.spacing?.borderRadius || override.spacing?.borderRadius) {
    merged.spacing = {
      ...merged.spacing,
      borderRadius: { ...base.spacing?.borderRadius, ...override.spacing?.borderRadius },
    };
  }

  // Handle nested objects in assets
  if (base.assets?.logo || override.assets?.logo) {
    merged.assets = {
      ...merged.assets,
      logo: { ...base.assets?.logo, ...override.assets?.logo },
    };
  }

  return merged as ThemeConfig;
}