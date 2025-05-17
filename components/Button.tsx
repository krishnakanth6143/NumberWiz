import React, { useRef } from 'react';
import { 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Animated,
  Pressable,
  View,
  Platform,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true, // This is already using native driver, which is correct
    }).start();
  };

  return (
    <View style={styles.buttonWrapper}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.pressable,
          pressed && !disabled && styles.pressedState,
        ]}
        android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
      >
        <Animated.View 
          style={[
            styles.button,
            { transform: [{ scale: scaleAnim }] },
            disabled && styles.disabledButton,
            style
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              disabled && styles.disabledText,
              textStyle
            ]}
          >
            {title}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  pressable: {
    overflow: 'hidden',
  },
  pressedState: {
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#8F7A66',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disabledButton: {
    backgroundColor: '#D3C1AA',
    shadowOpacity: 0.05,
    elevation: 1,
  },
  disabledText: {
    color: '#F2EFE9',
  },
});

export default Button;
