// GameLogic.ts - Utility functions for the game mechanics

export const GRID_SIZE = 4;
export const TARGET_NUMBER = 1024;

// Calculate target number based on level
export const getTargetForLevel = (level: number): number => {
  return level === 1 ? TARGET_NUMBER : TARGET_NUMBER * Math.pow(2, level - 1);
};

// Interface for cell position
interface Cell {
  row: number;
  col: number;
}

// Initialize a new grid with two random tiles
export const initializeGrid = (gridSize = GRID_SIZE): number[][] => {
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
  addRandomTile(grid);
  addRandomTile(grid);
  return grid;
};

// Add a new tile (2 or 4) to a random empty cell
export const addRandomTile = (grid: number[][]): number[][] => {
  const emptyCells: Cell[] = [];
  
  // Find all empty cells
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }
  
  // If there are empty cells, add a new tile
  if (emptyCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4; // 90% chance for 2, 10% chance for 4
    
    grid[cell.row][cell.col] = value;
  }
  
  return grid;
};

// Check if the game is over (no valid moves)
export const isGameOver = (grid: number[][]): boolean => {
  const gridSize = grid.length;
  
  // Check for empty cells
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) {
        return false;
      }
    }
  }
  
  // Check for possible merges horizontally
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize - 1; j++) {
      if (grid[i][j] === grid[i][j + 1]) {
        return false;
      }
    }
  }
  
  // Check for possible merges vertically
  for (let i = 0; i < gridSize - 1; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === grid[i + 1][j]) {
        return false;
      }
    }
  }
  
  return true;
};

// Process a single line (row or column) for movement and merging
export const processLine = (line: number[], currentScore: number): { line: number[], score: number, hasChanged: boolean } => {
  let newScore = currentScore;
  let hasChanged = false;
  const gridSize = line.length;
  
  // Remove zeros and store only the numbers
  const nonZero = line.filter(cell => cell !== 0);
  
  // Merge adjacent identical numbers
  const merged: number[] = [];
  for (let i = 0; i < nonZero.length; i++) {
    if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
      const mergedValue = nonZero[i] * 2;
      merged.push(mergedValue);
      newScore += mergedValue; // Add to score
      i++; // Skip the next number since we merged it
      hasChanged = true;
    } else {
      merged.push(nonZero[i]);
    }
  }
  
  // Fill the rest with zeros
  const result = [...merged, ...Array(gridSize - merged.length).fill(0)];
  
  // Check if the line changed
  if (JSON.stringify(line) !== JSON.stringify(result)) {
    hasChanged = true;
  }
  
  return { line: result, score: newScore, hasChanged };
};

// Move all tiles in the specified direction and handle merges
export const moveGrid = (grid: number[][], direction: 'up' | 'down' | 'left' | 'right', currentScore: number): { grid: number[][], score: number, hasChanged: boolean } => {
  let hasChanged = false;
  let newScore = currentScore;
  const gridSize = grid.length;
  const newGrid = JSON.parse(JSON.stringify(grid));
  
  switch (direction) {
    case 'left':
      for (let row = 0; row < gridSize; row++) {
        const result = processLine(newGrid[row], newScore);
        newGrid[row] = result.line;
        newScore = result.score;
        if (result.hasChanged) hasChanged = true;
      }
      break;
      
    case 'right':
      for (let row = 0; row < gridSize; row++) {
        const reversed = [...newGrid[row]].reverse();
        const result = processLine(reversed, newScore);
        newGrid[row] = result.line.reverse();
        newScore = result.score;
        if (result.hasChanged) hasChanged = true;
      }
      break;
      
    case 'up':
      for (let col = 0; col < gridSize; col++) {
        let line = [];
        for (let row = 0; row < gridSize; row++) {
          line.push(newGrid[row][col]);
        }
        
        const result = processLine(line, newScore);
        
        for (let row = 0; row < gridSize; row++) {
          newGrid[row][col] = result.line[row];
        }
        
        newScore = result.score;
        if (result.hasChanged) hasChanged = true;
      }
      break;
      
    case 'down':
      for (let col = 0; col < gridSize; col++) {
        let line = [];
        for (let row = 0; row < gridSize; row++) {
          line.push(newGrid[row][col]);
        }
        
        line.reverse();
        const result = processLine(line, newScore);
        result.line.reverse();
        
        for (let row = 0; row < gridSize; row++) {
          newGrid[row][col] = result.line[row];
        }
        
        newScore = result.score;
        if (result.hasChanged) hasChanged = true;
      }
      break;
  }
  
  return { grid: newGrid, score: newScore, hasChanged };
};

// Find the highest tile value in the grid
export const getHighestTile = (grid: number[][]): number => {
  let highest = 0;
  
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] > highest) {
        highest = grid[i][j];
      }
    }
  }
  
  return highest;
};

// Check if the target number has been reached
export const hasReachedTarget = (grid: number[][], target: number = TARGET_NUMBER): boolean => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] >= target) {
        return true;
      }
    }
  }
  
  return false;
};
