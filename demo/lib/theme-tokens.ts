/**
 * Hurstify brand palette mapped to shadcn CSS variables.
 * These hex values feed into globals.css @theme.
 */

export const hurstifyPalette = {
  amber: '#f0a030',
  amberDim: 'rgba(240, 160, 48, 0.15)',
  cyan: '#30d0f0',
  cyanDim: 'rgba(48, 208, 240, 0.15)',
  crimson: '#e03060',
  crimsonDim: 'rgba(224, 48, 96, 0.15)',
  bgBase: '#0a0e17',
  bgSurface: '#0f1525',
  bgElevated: '#141d33',
  textPrimary: '#c8d0e0',
  textSecondary: '#6a7a90',
  textMuted: '#3a4a60',
  border: 'rgba(58, 74, 96, 0.4)',
} as const;

export type BrandColor = keyof typeof hurstifyPalette;
