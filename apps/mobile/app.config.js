export default {
  expo: {
    name: 'Mobile App',
    slug: 'mobile-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.mobileapp'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.mobileapp'
    },
    web: {
      favicon: './assets/images/favicon.png',
      bundler: 'metro'
    },
    scheme: 'mobile-app',
    plugins: [
      'expo-router',
      'expo-system-ui'
    ],
    experiments: {
      typedRoutes: true
    }
  }
};