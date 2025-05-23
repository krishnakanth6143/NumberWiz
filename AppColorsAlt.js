const Colors = {
  // Main theme colors
  primary: '#4361EE',
  primaryLight: '#738FFE',
  primaryDark: '#3A56D4',
  secondary: '#F72585',
  secondaryLight: '#FF619A',
  secondaryDark: '#D81B76',
  
  // Backgrounds
  background: '#F8F9FF',
  surfaceLight: '#FFFFFF',
  surfaceMedium: '#EEF1FF',
  
  // Text colors
  textDark: '#2B2D42',
  textMedium: '#6C757D',
  textLight: '#ADB5BD',
  textOnDark: '#FFFFFF',
  
  // Game-specific colors
  gridBackground: '#DEE2E6',
  tileEmpty: 'rgba(220, 225, 235, 0.5)',
  
  // Accent colors
  success: '#06D6A0',
  warning: '#FFD166',
  danger: '#EF476F',
  highlight: '#FFDE59',
  
  // Gradients
  gradientStart: '#F8F9FF',
  gradientEnd: '#E0E7FF',
  
  // Theme compatibility
  light: {
    text: '#000',
    background: '#fff',
    tint: '#4361EE',
    tabIconDefault: '#ccc',
    tabIconSelected: '#4361EE',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#738FFE',
    tabIconDefault: '#ccc',
    tabIconSelected: '#738FFE',
  },
};

module.exports = Colors;
module.exports.Colors = Colors;
module.exports.default = Colors;
