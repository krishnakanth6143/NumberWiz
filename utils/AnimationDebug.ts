import { Platform } from 'react-native';

/**
 * Checks if the platform supports the native animation driver
 */
export function supportsNativeAnimations(): boolean {
  return Platform.OS !== 'web';
}

/**
 * Returns the appropriate useNativeDriver setting for the current platform
 * @param forTransform - Whether the animation is for a transform property
 * @returns boolean indicating if native driver should be used
 */
export function shouldUseNativeDriver(forTransform: boolean = true): boolean {
  // On Android and iOS, use native driver for transform and opacity animations
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    return forTransform;
  }
  
  // On web, native driver isn't available
  return false;
}

/**
 * Logs animation configuration details
 * @param animationConfig - The animation configuration object
 */
export function logAnimationConfig(animationConfig: Record<string, any>): void {
  console.log('Animation configuration:', {
    ...animationConfig,
    platformSupportsNative: supportsNativeAnimations(),
  });
}