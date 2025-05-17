import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../AppColors';

// Enhanced color mappings with new color pattern
const TILE_COLORS: {[key: string]: string} = {
  '0': Colors.tileEmpty,
  '2': '#AED6F1',    // Light blue
  '4': '#85C1E9',    // Medium blue
  '8': '#3498DB',    // Standard blue
  '16': '#2E86C1',   // Darker blue
  '32': '#9B59B6',   // Purple
  '64': '#8E44AD',   // Darker purple
  '128': '#F1C40F',  // Gold
  '256': '#F39C12',  // Orange
  '512': '#E67E22',  // Dark orange
  '1024': '#E74C3C', // Red
  '2048': '#C0392B', // Dark red
  '4096': '#1ABC9C', // Turquoise
  '8192': '#16A085', // Dark turquoise
};

// Text colors for tiles
const TEXT_COLORS: {[key: string]: string} = {
  '2': Colors.textDark,
  '4': Colors.textDark,
  '8': Colors.textOnDark,
  '16': Colors.textOnDark,
  '32': Colors.textOnDark,
  '64': Colors.textOnDark,
  '128': Colors.textOnDark,
  '256': Colors.textOnDark,
  '512': Colors.textOnDark,
  '1024': Colors.textOnDark,
  '2048': Colors.textOnDark,
  '4096': Colors.textOnDark,
  '8192': Colors.textOnDark,
};

interface NumberTileProps {
  value: number;
  size: number;
}

const NumberTile: React.FC<NumberTileProps> = ({ value, size }) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(value === 0 ? 1 : 0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(value === 0 ? 0.7 : 0)).current;
  // Enhanced glow animation for higher value tiles
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  // Determine text color based on tile value
  const textColor = TEXT_COLORS[value.toString()] || Colors.textOnDark;
  
  // Calculate font size based on number length and tile size
  const fontSize = value < 100 ? size * 0.45 : 
                  value < 1000 ? size * 0.35 : 
                  value < 10000 ? size * 0.25 : size * 0.2;
  
  // Get background color based on value, with fallback
  const backgroundColor = TILE_COLORS[value.toString()] || '#16A085';

  useEffect(() => {
    if (value > 0) {
      // Reset animations
      scaleAnim.setValue(0.3);
      rotateAnim.setValue(value % 2 === 0 ? -10 : 10);
      
      // Sequence of animations for new/updated tiles
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
      
      // Add pulsing glow effect for higher value tiles
      if (value >= 128) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true
            })
          ])
        ).start();
      } else {
        glowAnim.setValue(0);
      }
      
    } else {
      // Animation for empty tiles
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  // Render empty tile
  if (value === 0) {
    return (
      <Animated.View style={[
        styles.emptyTile, 
        { 
          width: size, 
          height: size,
          opacity: opacityAnim,
          margin: Math.max(2, size * 0.05), // Responsive margin
        }
      ]} />
    );
  }
  
  // Render number tile with enhanced styling
  return (
    <Animated.View style={[
      styles.tile, 
      { 
        backgroundColor, 
        width: size, 
        height: size,
        transform: [
          { scale: scaleAnim },
          { rotate: rotateAnim.interpolate({
              inputRange: [-10, 0, 10],
              outputRange: ['-10deg', '0deg', '10deg']
            })
          }
        ],
        opacity: opacityAnim,
        shadowOpacity: value >= 128 ? glowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 0.7]
        }) : 0.3,
        shadowRadius: value >= 128 ? glowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 8]
        }) : 4,
        shadowColor: value >= 128 ? '#F39C12' : '#000',
      }
    ]}>
      <Text style={[
        styles.tileText, 
        { 
          color: textColor, 
          fontSize 
        }
      ]}>
        {value}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emptyTile: {
    borderRadius: 10,
    backgroundColor: Colors.tileEmpty,
    margin: 5,
  },
  tile: {
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default NumberTile;
