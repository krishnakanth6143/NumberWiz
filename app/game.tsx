import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Alert, 
  SafeAreaView, 
  Animated, 
  TouchableOpacity,
  StatusBar,
  Platform,
  Image
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import NumberTile from '../components/NumberTile';
import Button from '../components/Button';
import ErrorBoundary from '../components/ErrorBoundary';
import { Colors } from '../AppColors';
import { 
  GRID_SIZE,
  initializeGrid, 
  addRandomTile, 
  isGameOver, 
  moveGrid, 
  getHighestTile, 
  hasReachedTarget,
  getTargetForLevel
} from '../utils/GameLogic';
import {
  loadHighScore,
  saveHighScore,
  loadBestTile,
  saveBestTile,
  saveCurrentLevel,
  loadCurrentLevel
} from '../utils/Storage';

type Direction = 'up' | 'down' | 'left' | 'right';

// Main game content component that will be wrapped with ErrorBoundary
function GameContent() {  
  const router = useRouter();
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [bestTile, setBestTile] = useState(2);
  const [gameOver, setGameOver] = useState(false);
  const [gridHistory, setGridHistory] = useState<number[][][]>([]);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [level, setLevel] = useState(1);
  
  // Animation values - separating native and JS driven animations
  const scoreAnim = useRef(new Animated.Value(1)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const gameInfoAnim = useRef(new Animated.Value(0)).current;
  
  // JS-specific animated values (for color interpolations)
  const scoreBgAnim = useRef(new Animated.Value(0)).current;
  const gridBgAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate dimensions for responsive layout
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isSmallDevice = windowHeight < 700;
  
  // Calculate grid dimensions
  const gridPadding = 10;
  const gridSize = Math.min(windowWidth - 40, windowHeight * (isSmallDevice ? 0.4 : 0.45));
  const tileSize = (gridSize - (gridPadding * 2) - ((GRID_SIZE - 1) * 10)) / GRID_SIZE;
  const tileMargin = Math.max(2, tileSize * 0.05);

  // Initialize the game
  useEffect(() => {
    // Initialize with entrance animations - separating native and JS animations
    // Native driver animations
    Animated.stagger(150, [
      Animated.spring(headerAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(gameInfoAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    // JS driven animations (for backgroundColor changes)
    Animated.timing(gridBgAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load saved data and initialize game
  const initGame = async () => {
    const savedHighScore = await loadHighScore();
    const savedBestTile = await loadBestTile();
    const savedLevel = await loadCurrentLevel();

    setHighScore(savedHighScore);
    setBestTile(savedBestTile);
    setLevel(savedLevel);
    resetGame();
  };

  // Save high score and best tile whenever they change
  useEffect(() => {
    if (highScore > 0) saveHighScore(highScore);
    if (bestTile > 2) saveBestTile(bestTile);
  }, [highScore, bestTile]);

  // Reset the game
  const resetGame = () => {
    const newGrid = initializeGrid();
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setGridHistory([]);
    setScoreHistory([]);
  };

  // Save current state before making a move
  const saveState = () => {
    setGridHistory(prev => [...prev, JSON.parse(JSON.stringify(grid))]);
    setScoreHistory(prev => [...prev, score]);
  };

  // Undo the last move
  const undoMove = () => {
    if (gridHistory.length > 0 && scoreHistory.length > 0) {
      const lastGrid = gridHistory[gridHistory.length - 1];
      const lastScore = scoreHistory[scoreHistory.length - 1];
      
      setGrid(lastGrid);
      setScore(lastScore);
      setGridHistory(gridHistory.slice(0, -1));
      setScoreHistory(scoreHistory.slice(0, -1));
      setGameOver(false);
    }
  };  
  // Handle swipe gestures
  const onGestureEvent = (event: any) => {
    if (gameOver) return;
    
    const { translationX, translationY } = event.nativeEvent;
    
    // Determine swipe direction based on which translation is larger
    if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX > 50) {
        handleMove('right');
      } else if (translationX < -50) {
        handleMove('left');
      }
    } else {
      if (translationY > 50) {
        handleMove('down');
      } else if (translationY < -50) {
        handleMove('up');
      }
    }
  };

  // Process a move in the specified direction
  const handleMove = (direction: Direction) => {
    // Save current state for undo
    saveState();
    
    // Move tiles
    const { grid: newGrid, score: newScore, hasChanged } = moveGrid(grid, direction, score);
    
    // Only update if something changed
    if (hasChanged) {
      // Add a new random tile
      addRandomTile(newGrid);
      
      // Update grid and score
      setGrid(newGrid);
      setScore(newScore);
      
      // Enhance animations for score changes - using native driver
      scoreAnim.setValue(1.3);
      Animated.spring(scoreAnim, {
        toValue: 1,
        friction: 3,
        tension: 140,
        useNativeDriver: true,
      }).start();
      
      // Enhanced grid background pulse animation - using JS driver
      gridBgAnim.setValue(0.3);
      Animated.timing(gridBgAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false, // backgroundColor must use JS driver
      }).start();
      
      // Update high score if needed
      if (newScore > highScore) {
        setHighScore(newScore);
        
        // Animate background flash for new high score - using JS driver
        scoreBgAnim.setValue(1);
        Animated.timing(scoreBgAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false, // backgroundColor must use JS driver
        }).start();
      }
      
      // Update best tile
      const highestTile = getHighestTile(newGrid);
      if (highestTile > bestTile) {
        setBestTile(highestTile);
      }
      
      // Check if target reached
      if (hasReachedTarget(newGrid, getTargetForLevel(level))) {
        setLevel(prev => {
          const newLevel = prev + 1;
          saveCurrentLevel(newLevel);
          return newLevel;
        });
        
        Alert.alert(
          "Congratulations!",
          `You've reached ${getTargetForLevel(level)}! You advanced to level ${level + 1}!`,
          [{ text: "Continue", style: "default" }]
        );
      }
      
      // Check if game over
      if (isGameOver(newGrid)) {
        setGameOver(true);
        Alert.alert(
          "Game Over",
          `Your score: ${newScore}`,
          [
            { 
              text: "New Game", 
              onPress: resetGame 
            }
          ]
        );
      }
    }
  };
  
  return (
    <LinearGradient
      colors={[Colors.background, Colors.surfaceMedium]}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Game Header with improved styling */}
        <Animated.View style={[
          styles.header,
          { 
            opacity: headerAnim,
            transform: [{ translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })}] 
          }
        ]}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>NumberWiz</Text>
            <TouchableOpacity 
              style={styles.homeButton}
              onPress={() => router.push('/')}
            >
              <Ionicons name="home-outline" size={22} color={Colors.textOnDark} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scoreContainer}>
            <Animated.View 
              style={[
                styles.scoreBox,
                {
                  transform: [{ scale: scoreAnim }],
                  backgroundColor: scoreBgAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Colors.primaryDark, Colors.highlight]
                  })
                }
              ]}
            >
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreValue}>{score}</Text>
            </Animated.View>
            
            <View style={styles.scoreBox}>
              <Text style={styles.scoreLabel}>BEST</Text>
              <Text style={styles.scoreValue}>{highScore}</Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Enhanced Game Info */}
        <Animated.View style={[
          styles.gameInfo,
          {
            opacity: gameInfoAnim,
            transform: [{ scale: gameInfoAnim }]
          }
        ]}>
          <View style={styles.infoBox}>
            <Ionicons name="layers-outline" size={18} color={Colors.textDark} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>LEVEL</Text>
            <Text style={styles.infoValue}>{level}</Text>
          </View>
          
          <View style={[styles.infoBox, styles.targetInfoBox]}>
            <Ionicons name="flag-outline" size={18} color={Colors.textDark} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>TARGET</Text>
            <Text style={[styles.infoValue, styles.targetValue]}>{getTargetForLevel(level)}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Ionicons name="trophy-outline" size={18} color={Colors.textDark} style={styles.infoIcon} />
            <Text style={styles.infoLabel}>BEST TILE</Text>
            <Text style={styles.infoValue}>{bestTile}</Text>
          </View>
        </Animated.View>
        
        {/* Improved Game Grid */}
        <Animated.View style={[{
          backgroundColor: gridBgAnim.interpolate({
            inputRange: [0, 0.3],
            outputRange: [Colors.gridBackground, Colors.highlight]
          }),
          borderRadius: 16,
          padding: 14,
          alignSelf: 'center',
          width: gridSize,
          height: gridSize,
        }, styles.gridWrapper]}>
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <View style={styles.gridContainer}>
              {grid.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((cell, colIndex) => (
                    <NumberTile 
                      key={`${rowIndex}-${colIndex}`} 
                      value={cell}
                      size={tileSize - (tileMargin * 2)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </PanGestureHandler>
        </Animated.View>
        
        {/* Enhanced Swipe Hint Card */}
        <Animated.View style={[styles.swipeHintCard, {
          opacity: gameInfoAnim,
          transform: [{ translateY: gameInfoAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0]
          })}]
        }]}>
          <Ionicons name="swap-horizontal-outline" size={18} color={Colors.textDark} />
          <Text style={styles.swipeHint}>Swipe to move tiles</Text>
        </Animated.View>

        {/* Controls with improved styling */}
        <View style={styles.controlsContainer}>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>              <Button 
                title="Undo" 
                onPress={undoMove}
                disabled={gridHistory.length === 0}
                style={{
                  ...styles.undoButton, 
                  opacity: gridHistory.length === 0 ? 0.6 : 1
                }}
                textStyle={styles.buttonText}
              />
            </View>
            
            <View style={styles.buttonWrapper}>
              <Button 
                title="New Game"
                onPress={resetGame}
                style={styles.newGameButton}
                textStyle={styles.buttonText}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 20,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 15,
  },
  titleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.primary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  homeButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 14,
  },
  scoreBox: {
    backgroundColor: Colors.primaryDark,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 90,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  scoreLabel: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreValue: {
    color: Colors.textOnDark,
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  infoBox: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    alignItems: 'center',
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  targetInfoBox: {
    backgroundColor: Colors.highlight,
  },
  infoIcon: {
    marginBottom: 6,
    opacity: 0.8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textMedium,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  targetValue: {
    color: Colors.danger,
  },
  gridWrapper: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '25%',
  },
  swipeHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  swipeHint: {
    color: Colors.textDark,
    fontWeight: '600',
    fontSize: 15,
  },
  controlsContainer: {
    marginTop: 20,
    paddingBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  buttonWrapper: {
    flex: 1,
  },
  undoButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
  },
  newGameButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
  },  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.textOnDark,
  },
});

// Export the game screen wrapped in an error boundary
export default function GameScreen() {
  return (
    <ErrorBoundary>
      <GameContent />
    </ErrorBoundary>
  );
}
