import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  Animated, 
  Dimensions, 
  StatusBar,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Colors from '../constants/Colors';
import { loadHighScore, loadBestTile, loadCurrentLevel } from '../utils/Storage';

export default function HomeScreen() {
  const router = useRouter();
  const [highScore, setHighScore] = useState(0);
  const [bestTile, setBestTile] = useState(2);
  const [level, setLevel] = useState(1);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const statsAnim = useRef(new Animated.Value(0.9)).current;
  
  useEffect(() => {
    const loadData = async () => {
      const savedHighScore = await loadHighScore();
      const savedBestTile = await loadBestTile();
      const savedLevel = await loadCurrentLevel();

      setHighScore(savedHighScore);
      setBestTile(savedBestTile);
      setLevel(savedLevel);
    };

    // Load data from storage
    loadData();

    // Animate elements when screen loads
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(statsAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.gradientStart, Colors.gradientEnd]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        <Animated.View 
          style={[
            styles.titleContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.logoIconContainer}>
            <Ionicons name="grid-outline" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.title}>NumberWiz</Text>
          <Text style={styles.subtitle}>Merge • Match • Win</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.statsGrid,
            {
              transform: [{ scale: statsAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={24} color={Colors.primary} style={styles.statIcon} />
            <Text style={styles.statLabel}>HIGH SCORE</Text>
            <Text style={styles.statValue}>{highScore.toLocaleString()}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="diamond-outline" size={24} color={Colors.primary} style={styles.statIcon} />
            <Text style={styles.statLabel}>BEST TILE</Text>
            <Text style={styles.statValue}>{bestTile}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="layers-outline" size={24} color={Colors.primary} style={styles.statIcon} />
            <Text style={styles.statLabel}>LEVEL</Text>
            <Text style={styles.statValue}>{level}</Text>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.buttonContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.buttonWrapper}>
            <Button 
              title="Play Game"
              onPress={() => router.push('/game')}
              style={styles.playButton}
              textStyle={styles.playButtonText}
            />
          </View>
          
          <View style={styles.buttonWrapper}>
            <Button
              title="How to Play"
              onPress={() => router.push('/howtoplay')}
              style={styles.howToButton}
              textStyle={styles.howToButtonText}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 34 : 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.primary,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    letterSpacing: 2,
    color: Colors.secondary,
    fontWeight: '600',
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  statIcon: {
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMedium,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  buttonWrapper: {
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
  },
  playButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  howToButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  howToButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textOnDark,
  },
});
