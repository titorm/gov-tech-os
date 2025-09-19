export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const SCREEN_NAMES = {
  HOME: 'Home',
  EXPLORE: 'Explore',
  PROFILE: 'Profile',
} as const;

export const COLORS = {
  PRIMARY: '#6750A4',
  SECONDARY: '#625B71',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800',
  ERROR: '#F44336',
  INFO: '#2196F3',
} as const;

export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
} as const;

export const TYPOGRAPHY = {
  DISPLAY_LARGE: 57,
  DISPLAY_MEDIUM: 45,
  DISPLAY_SMALL: 36,
  HEADLINE_LARGE: 32,
  HEADLINE_MEDIUM: 28,
  HEADLINE_SMALL: 24,
  TITLE_LARGE: 22,
  TITLE_MEDIUM: 16,
  TITLE_SMALL: 14,
  LABEL_LARGE: 14,
  LABEL_MEDIUM: 12,
  LABEL_SMALL: 11,
  BODY_LARGE: 16,
  BODY_MEDIUM: 14,
  BODY_SMALL: 12,
} as const;