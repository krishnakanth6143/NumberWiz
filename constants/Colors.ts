/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Central color palette for the NumberWiz app

export const Colors = {
  // Main theme colors
  primary: '#4361EE',        // Vibrant blue
  primaryLight: '#738FFE',   // Light blue
  primaryDark: '#3A56D4',    // Dark blue
  secondary: '#F72585',      // Hot pink
  secondaryLight: '#FF619A',
  secondaryDark: '#D81B76',
  
  // Backgrounds
  background: '#F8F9FF',     // Light blue-tinted background
  surfaceLight: '#FFFFFF',   // White surface
  surfaceMedium: '#EEF1FF',  // Light blue-gray surface
  
  // Text colors
  textDark: '#2B2D42',       // Almost black
  textMedium: '#6C757D',     // Medium gray
  textLight: '#ADB5BD',      // Light gray
  textOnDark: '#FFFFFF',     // White text
  
  // Game-specific colors
  gridBackground: '#DEE2E6',
  tileEmpty: 'rgba(220, 225, 235, 0.5)',
  
  // Accent colors
  success: '#06D6A0',        // Teal
  warning: '#FFD166',        // Yellow
  danger: '#EF476F',         // Red
  highlight: '#FFDE59',      // Bright yellow
  
  // Gradients
  gradientStart: '#F8F9FF',
  gradientEnd: '#E0E7FF',
  
  // For theme compatibility with the tab screens
  light: {
    text: '#000',
    background: '#fff',
    tint: '#4361EE', // Use primary color as tint
    tabIconDefault: '#ccc',
    tabIconSelected: '#4361EE',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#738FFE', // Use primaryLight as tint in dark mode
    tabIconDefault: '#ccc',
    tabIconSelected: '#738FFE',
  },
};

export default Colors;
