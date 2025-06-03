type SSymbol = string | number;
type Reel = SSymbol[];
type Grid = Reel[];

interface Match {
  symbol: SSymbol;
  positions: Array<[row: number, col: number]>;
  type: "horizontal" | "diagonal-down" | "diagonal-up";
}

class SlotPatternMatcher {
  private grid: Grid;
  private rows: number;
  private cols: number;
  private minMatchLength: number = 3;

  constructor(grid: Grid) {
    this.grid = grid;
    this.rows = grid[0]?.length || 0;
    this.cols = grid.length;
  }

  /**
   * Find all valid matches in the slot grid
   */
  findAllMatches(): Match[] {
    const matches: Match[] = [];

    // Check horizontal matches
    for (let row = 0; row < this.rows; row++) {
      const horizontalMatch = this.checkHorizontal(row);
      if (horizontalMatch) {
        matches.push(horizontalMatch);
      }
    }

    // Check diagonal matches (down)
    for (let row = 0; row < this.rows; row++) {
      const diagonalDownMatch = this.checkDiagonalDown(row);
      if (diagonalDownMatch) {
        matches.push(diagonalDownMatch);
      }
    }

    // Check diagonal matches (up)
    for (let row = 0; row < this.rows; row++) {
      const diagonalUpMatch = this.checkDiagonalUp(row);
      if (diagonalUpMatch) {
        matches.push(diagonalUpMatch);
      }
    }

    return matches;
  }

  /**
   * Check for horizontal matches starting from leftmost reel
   */
  private checkHorizontal(row: number): Match | null {
    const startSymbol = this.grid[0][row];
    if (!startSymbol) return null;

    const positions: Array<[number, number]> = [[row, 0]];

    // Check consecutive matches from left to right
    for (let col = 1; col < this.cols; col++) {
      if (this.grid[col][row] === startSymbol) {
        positions.push([row, col]);
      } else {
        break; // Stop at first non-match
      }
    }

    if (positions.length >= this.minMatchLength) {
      return {
        symbol: startSymbol,
        positions,
        type: "horizontal",
      };
    }

    return null;
  }

  /**
   * Check for diagonal matches (top-left to bottom-right) starting from leftmost reel
   */
  private checkDiagonalDown(startRow: number): Match | null {
    const startSymbol = this.grid[0][startRow];
    if (!startSymbol) return null;

    const positions: Array<[number, number]> = [[startRow, 0]];
    let currentRow = startRow;

    // Check diagonal down (row increases as we go right)
    for (let col = 1; col < this.cols; col++) {
      currentRow++;
      if (currentRow >= this.rows) break;

      if (this.grid[col][currentRow] === startSymbol) {
        positions.push([currentRow, col]);
      } else {
        break; // Stop at first non-match
      }
    }

    if (positions.length >= this.minMatchLength) {
      return {
        symbol: startSymbol,
        positions,
        type: "diagonal-down",
      };
    }

    return null;
  }

  /**
   * Check for diagonal matches (bottom-left to top-right) starting from leftmost reel
   */
  private checkDiagonalUp(startRow: number): Match | null {
    const startSymbol = this.grid[0][startRow];
    if (!startSymbol) return null;

    const positions: Array<[number, number]> = [[startRow, 0]];
    let currentRow = startRow;

    // Check diagonal up (row decreases as we go right)
    for (let col = 1; col < this.cols; col++) {
      currentRow--;
      if (currentRow < 0) break;

      if (this.grid[col][currentRow] === startSymbol) {
        positions.push([currentRow, col]);
      } else {
        break; // Stop at first non-match
      }
    }

    if (positions.length >= this.minMatchLength) {
      return {
        symbol: startSymbol,
        positions,
        type: "diagonal-up",
      };
    }

    return null;
  }

  /**
   * Pretty print the grid with highlighted matches
   */
  printGridWithMatches(matches: Match[]): void {
    console.log("\nSlot Grid:");

    // Create a map of positions to highlight
    const highlightMap = new Map<string, string>();
    matches.forEach((match, index) => {
      match.positions.forEach(([row, col]) => {
        highlightMap.set(`${row},${col}`, `[${index + 1}]`);
      });
    });

    // Print the grid
    for (let row = 0; row < this.rows; row++) {
      let rowStr = "";
      for (let col = 0; col < this.cols; col++) {
        const symbol = this.grid[col][row];
        const highlight = highlightMap.get(`${row},${col}`);
        rowStr += highlight ? `${symbol}${highlight}` : ` ${symbol} `;
        rowStr += " ";
      }
      console.log(rowStr);
    }

    // Print match details
    console.log("\nMatches found:");
    matches.forEach((match, index) => {
      console.log(
        `[${index + 1}] ${match.type}: ${match.symbol} x${match.positions.length}`,
      );
    });
  }
}

// Example usage:
const exampleGrid: Grid = [
  ["A", "B", "C", "A", "B"], // Reel 1 (leftmost)
  ["A", "A", "B", "C", "A"], // Reel 2
  ["A", "B", "A", "B", "C"], // Reel 3
  ["B", "C", "B", "A", "B"], // Reel 4
  ["C", "A", "C", "B", "A"], // Reel 5 (rightmost)
];

const matcher = new SlotPatternMatcher(exampleGrid);
const matches = matcher.findAllMatches();

console.log("Found matches:", matches);
matcher.printGridWithMatches(matches);

// Another example with more matches:
const exampleGrid2: Grid = [
  ["7", "7", "7", "B"], // Reel 1
  ["7", "B", "7", "A"], // Reel 2
  ["7", "A", "B", "7"], // Reel 3
  ["A", "7", "C", "B"], // Reel 4
  ["B", "C", "7", "A"], // Reel 5
];

console.log("\n\nExample 2:");
const matcher2 = new SlotPatternMatcher(exampleGrid2);
const matches2 = matcher2.findAllMatches();
console.log("Found matches:", matches2);
matcher2.printGridWithMatches(matches2);
