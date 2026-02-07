export interface Tile {
  type: number;
  id: string;
}

export interface Position {
  row: number;
  col: number;
}

const BOARD_SIZE = 6;
const FLOWER_TYPES = 6;

export function generateBoard(): Tile[][] {
  const board: Tile[][] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    board[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      board[row][col] = {
        type: Math.floor(Math.random() * FLOWER_TYPES),
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
      };
    }
  }
  return board;
}

export function isAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function canExtendChain(
  board: Tile[][],
  chain: Position[],
  newPos: Position
): boolean {
  if (chain.length === 0) return true;

  // Check if already in chain
  if (chain.some((pos) => pos.row === newPos.row && pos.col === newPos.col)) {
    return false;
  }

  // Check if adjacent to last tile in chain
  const lastPos = chain[chain.length - 1];
  if (!isAdjacent(lastPos, newPos)) {
    return false;
  }

  // Check if same type
  const chainType = board[chain[0].row][chain[0].col].type;
  const newType = board[newPos.row][newPos.col].type;
  return chainType === newType;
}

export function calculateScore(chainLength: number): number {
  if (chainLength < 3) return 0;
  return chainLength * chainLength * 10;
}

export function removeChainAndRefill(board: Tile[][], chain: Position[]): Tile[][] {
  const newBoard = board.map((row) => row.map((tile) => ({ ...tile })));

  // Mark tiles for removal
  const toRemove = new Set(chain.map((pos) => `${pos.row}-${pos.col}`));

  // Remove tiles and shift down
  for (let col = 0; col < BOARD_SIZE; col++) {
    let writeRow = BOARD_SIZE - 1;
    for (let row = BOARD_SIZE - 1; row >= 0; row--) {
      if (!toRemove.has(`${row}-${col}`)) {
        if (writeRow !== row) {
          newBoard[writeRow][col] = newBoard[row][col];
        }
        writeRow--;
      }
    }

    // Fill empty spaces at top with new tiles
    for (let row = writeRow; row >= 0; row--) {
      newBoard[row][col] = {
        type: Math.floor(Math.random() * FLOWER_TYPES),
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
      };
    }
  }

  return newBoard;
}
