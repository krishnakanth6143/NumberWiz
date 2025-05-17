// Storage.ts - Utilities for AsyncStorage operations
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  highScore: '@NumberWiz:highScore',
  bestTile: '@NumberWiz:bestTile', 
  currentLevel: '@NumberWiz:currentLevel',
  gameState: '@NumberWiz:gameState'
};

// Save the high score
export const saveHighScore = async (score: number) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.highScore, score.toString());
    return true;
  } catch (error) {
    console.error('Error saving high score:', error);
    return false;
  }
};

// Load the high score
export const loadHighScore = async (): Promise<number> => {
  try {
    const savedScore = await AsyncStorage.getItem(STORAGE_KEYS.highScore);
    return savedScore ? parseInt(savedScore) : 0;
  } catch (error) {
    console.error('Error loading high score:', error);
    return 0;
  }
};

// Save the best tile value
export const saveBestTile = async (tileValue: number) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.bestTile, tileValue.toString());
    return true;
  } catch (error) {
    console.error('Error saving best tile:', error);
    return false;
  }
};

// Load the best tile value
export const loadBestTile = async (): Promise<number> => {
  try {
    const savedTile = await AsyncStorage.getItem(STORAGE_KEYS.bestTile);
    return savedTile ? parseInt(savedTile) : 2;
  } catch (error) {
    console.error('Error loading best tile:', error);
    return 2;
  }
};

// Save the current level
export const saveCurrentLevel = async (level: number) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.currentLevel, level.toString());
    return true;
  } catch (error) {
    console.error('Error saving current level:', error);
    return false;
  }
};

// Load the current level
export const loadCurrentLevel = async (): Promise<number> => {
  try {
    const savedLevel = await AsyncStorage.getItem(STORAGE_KEYS.currentLevel);
    return savedLevel ? parseInt(savedLevel) : 1;
  } catch (error) {
    console.error('Error loading current level:', error);
    return 1;
  }
};

// Save the entire game state
export const saveGameState = async (gameState: any) => {
  try {
    const jsonValue = JSON.stringify(gameState);
    await AsyncStorage.setItem(STORAGE_KEYS.gameState, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
};

// Load the entire game state
export const loadGameState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.gameState);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

// Clear all saved data (for resets)
export const clearAllData = async () => {
  try {
    const keys = Object.values(STORAGE_KEYS);
    await AsyncStorage.multiRemove(keys);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
