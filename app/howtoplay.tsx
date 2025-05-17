import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function HowToPlayScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <LinearGradient
      colors={[Colors.background, Colors.surfaceMedium]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>How to Play</Text>
        </Animated.View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="trophy-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Objective</Text>
            <Text style={styles.text}>
              Merge tiles to create a tile with the number 1024! Once you reach 1024, you can keep going to achieve higher numbers and advance to the next level.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="finger-print-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Controls</Text>
            <Text style={styles.text}>
              Swipe up, down, left, or right to move all tiles in that direction. When two tiles with the same number touch, they merge into one tile with double the value!
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="bar-chart-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Scoring</Text>
            <Text style={styles.text}>
              You get points when two tiles merge. The number of points you get equals the value of the new tile. For example, merging two 4 tiles gives you 8 points.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="close-circle-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Game Over</Text>
            <Text style={styles.text}>
              The game ends when the grid is full and no more moves are possible (no adjacent tiles with the same number).
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="arrow-undo-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Undo</Text>
            <Text style={styles.text}>
              If you make a mistake, you can use the Undo button to go back one move.
            </Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionIcon}>
              <Ionicons name="bulb-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.sectionTitle}>Strategy Tips</Text>
            <View style={styles.tipContainer}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Keep your largest tile in a corner</Text>
            </View>
            <View style={styles.tipContainer}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Focus on merging smaller tiles first</Text>
            </View>
            <View style={styles.tipContainer}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Plan your moves carefully to avoid getting stuck</Text>
            </View>
            <View style={styles.tipContainer}>
              <View style={styles.tipBullet} />
              <Text style={styles.tipText}>Build a chain of decreasing values from your largest tile</Text>
            </View>
          </View>
          
          <Animated.View style={{ opacity: fadeAnim, marginTop: 20, marginBottom: 30 }}>
            <View style={{ width: '100%' }}>
              <Button 
                title="Back to Home"
                onPress={() => router.push('/')}
                style={{ backgroundColor: Colors.primary }}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  section: {
    marginBottom: 25,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionIcon: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 24,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondary,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textDark,
    lineHeight: 22,
  },
  backButton: {
    marginTop: 20,
    marginBottom: 30,
  }
});
