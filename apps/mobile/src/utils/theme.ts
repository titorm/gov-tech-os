import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '100' as const,
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as const,
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100' as const,
    },
  },
};

export const theme = {
  ...MD3LightTheme,
  // Cast to any to avoid a strict typing mismatch with react-native-paper's MD3Type
  // definitions coming from the installed package. The runtime behavior is unchanged.
  fonts: configureFonts({ config: fontConfig } as any),
  colors: {
    ...MD3LightTheme.colors,
    primary: 'rgb(103, 80, 164)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(234, 221, 255)',
    onPrimaryContainer: 'rgb(33, 0, 93)',
    secondary: 'rgb(98, 91, 113)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(232, 222, 248)',
    onSecondaryContainer: 'rgb(29, 25, 43)',
    tertiary: 'rgb(125, 82, 96)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(255, 216, 228)',
    onTertiaryContainer: 'rgb(49, 16, 29)',
    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',
    background: 'rgb(255, 251, 254)',
    onBackground: 'rgb(28, 27, 31)',
    surface: 'rgb(255, 251, 254)',
    onSurface: 'rgb(28, 27, 31)',
    surfaceVariant: 'rgb(233, 223, 235)',
    onSurfaceVariant: 'rgb(73, 69, 79)',
    outline: 'rgb(124, 117, 126)',
    outlineVariant: 'rgb(204, 196, 206)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(50, 47, 51)',
    inverseOnSurface: 'rgb(245, 239, 244)',
    inversePrimary: 'rgb(208, 188, 255)',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  // Cast to any for the dark theme as well.
  fonts: configureFonts({ config: fontConfig } as any),
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'rgb(208, 188, 255)',
    onPrimary: 'rgb(54, 44, 63)',
    primaryContainer: 'rgb(78, 62, 113)',
    onPrimaryContainer: 'rgb(234, 221, 255)',
    secondary: 'rgb(204, 194, 220)',
    onSecondary: 'rgb(51, 47, 63)',
    secondaryContainer: 'rgb(74, 69, 88)',
    onSecondaryContainer: 'rgb(232, 222, 248)',
    tertiary: 'rgb(227, 187, 200)',
    onTertiary: 'rgb(72, 38, 50)',
    tertiaryContainer: 'rgb(98, 59, 72)',
    onTertiaryContainer: 'rgb(255, 216, 228)',
    error: 'rgb(255, 180, 171)',
    onError: 'rgb(105, 0, 5)',
    errorContainer: 'rgb(147, 0, 10)',
    onErrorContainer: 'rgb(255, 218, 214)',
    background: 'rgb(16, 14, 19)',
    onBackground: 'rgb(231, 225, 229)',
    surface: 'rgb(16, 14, 19)',
    onSurface: 'rgb(231, 225, 229)',
    surfaceVariant: 'rgb(73, 69, 79)',
    onSurfaceVariant: 'rgb(204, 196, 206)',
    outline: 'rgb(150, 142, 152)',
    outlineVariant: 'rgb(73, 69, 79)',
    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',
    inverseSurface: 'rgb(231, 225, 229)',
    inverseOnSurface: 'rgb(50, 47, 51)',
    inversePrimary: 'rgb(103, 80, 164)',
  },
};

// Provide typed exports (cast-only) to satisfy callers that expect MD3 theme types.
export const typedTheme = theme as unknown as typeof MD3LightTheme;
export const typedDarkTheme = darkTheme as unknown as typeof MD3DarkTheme;
