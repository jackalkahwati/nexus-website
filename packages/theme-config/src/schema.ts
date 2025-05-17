import { z } from 'zod';

/**
 * Font configuration
 */
export const FontConfigSchema = z.object({
  family: z.string().optional(),
  headingFamily: z.string().optional(),
  baseSize: z.string().optional().default('16px'),
  lineHeight: z.number().optional().default(1.5),
  weights: z.object({
    thin: z.number().optional().default(100),
    extraLight: z.number().optional().default(200),
    light: z.number().optional().default(300),
    normal: z.number().optional().default(400),
    medium: z.number().optional().default(500),
    semiBold: z.number().optional().default(600),
    bold: z.number().optional().default(700),
    extraBold: z.number().optional().default(800),
    black: z.number().optional().default(900),
  }).optional(),
});

/**
 * Color configuration
 */
export const ColorConfigSchema = z.object({
  // Brand colors
  primary: z.string(),
  primaryLight: z.string().optional(),
  primaryDark: z.string().optional(),
  secondary: z.string(),
  secondaryLight: z.string().optional(),
  secondaryDark: z.string().optional(),
  accent: z.string().optional(),
  
  // UI colors
  background: z.string().optional(),
  foreground: z.string().optional(),
  card: z.string().optional(),
  cardForeground: z.string().optional(),
  popover: z.string().optional(),
  popoverForeground: z.string().optional(),
  
  // Status colors
  success: z.string().optional(),
  warning: z.string().optional(),
  error: z.string().optional(),
  info: z.string().optional(),
  
  // Text colors
  text: z.string().optional(),
  textMuted: z.string().optional(),
  textDisabled: z.string().optional(),
  
  // Border colors
  border: z.string().optional(),
  inputBorder: z.string().optional(),
  
  // Button colors
  buttonText: z.string().optional(),
  buttonBackground: z.string().optional(),
  buttonHover: z.string().optional(),
});

/**
 * Spacing and layout configuration
 */
export const SpacingConfigSchema = z.object({
  base: z.number().optional().default(4),
  unit: z.string().optional().default('px'),
  scale: z.record(z.string(), z.number()).optional(),
  borderRadius: z.object({
    small: z.string().optional().default('2px'),
    medium: z.string().optional().default('4px'),
    large: z.string().optional().default('8px'),
    full: z.string().optional().default('9999px'),
  }).optional(),
});

/**
 * Breakpoints configuration
 */
export const BreakpointsConfigSchema = z.object({
  xs: z.string().optional().default('480px'),
  sm: z.string().optional().default('640px'),
  md: z.string().optional().default('768px'),
  lg: z.string().optional().default('1024px'),
  xl: z.string().optional().default('1280px'),
  '2xl': z.string().optional().default('1536px'),
});

/**
 * Brand assets configuration
 */
export const BrandAssetsSchema = z.object({
  logo: z.object({
    default: z.string(),
    small: z.string().optional(),
    dark: z.string().optional(),
  }),
  favicon: z.string().optional(),
  appIcon: z.string().optional(),
  socialImage: z.string().optional(),
  backgroundImage: z.string().optional(),
  authPageBackground: z.string().optional(),
  loader: z.string().optional(),
});

/**
 * Theme configuration schema
 */
export const ThemeConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional().default('1.0.0'),
  
  // Visual configuration
  colors: ColorConfigSchema,
  fonts: FontConfigSchema.optional(),
  spacing: SpacingConfigSchema.optional(),
  breakpoints: BreakpointsConfigSchema.optional(),
  
  // Brand assets
  assets: BrandAssetsSchema,
  
  // Feature configuration
  features: z.object({
    darkMode: z.boolean().optional().default(true),
    themeSwitcher: z.boolean().optional().default(false),
    customAccentColor: z.boolean().optional().default(false),
  }).optional(),
  
  // SEO configuration
  seo: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
  }).optional(),
  
  // Metadata
  meta: z.record(z.string(), z.any()).optional(),
});

// Export the types
export type FontConfig = z.infer<typeof FontConfigSchema>;
export type ColorConfig = z.infer<typeof ColorConfigSchema>;
export type SpacingConfig = z.infer<typeof SpacingConfigSchema>;
export type BreakpointsConfig = z.infer<typeof BreakpointsConfigSchema>;
export type BrandAssets = z.infer<typeof BrandAssetsSchema>;
export type ThemeConfig = z.infer<typeof ThemeConfigSchema>;