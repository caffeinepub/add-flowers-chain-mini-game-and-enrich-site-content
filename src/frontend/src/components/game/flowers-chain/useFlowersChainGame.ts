import { useState, useCallback } from 'react';
import {
  Tile,
  Position,
  generateBoard,
  canExtendChain,
  calculateScore,
  removeChainAndRefill,
} from './flowersChainLogic';

const INITIAL_MOVES = 20;

export function useFlowersChainGame() {
  const [board, setBoard] = useState<Tile[][] | null>(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(INITIAL_MOVES);
  const [currentChain, setCurrentChain] = useState<Position[]>([]);
  const [gameOver, setGameOver] = useState(false);

  const startGame = useCallback(() => {
    setBoard(generateBoard());
    setScore(0);
    setMovesLeft(INITIAL_MOVES);
    setCurrentChain([]);
    setGameOver(false);
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const startChain = useCallback(
    (row: number, col: number) => {
      if (!board || gameOver) return;
      setCurrentChain([{ row, col }]);
    },
    [board, gameOver]
  );

  const extendChain = useCallback(
    (row: number, col: number) => {
      if (!board || gameOver) return;

      const newPos = { row, col };

      if (canExtendChain(board, currentChain, newPos)) {
        setCurrentChain([...currentChain, newPos]);
      } else {
        // If can't extend, try starting a new chain
        setCurrentChain([newPos]);
      }
    },
    [board, currentChain, gameOver]
  );

  const endChain = useCallback(() => {
    if (!board || currentChain.length < 3) {
      setCurrentChain([]);
      return;
    }

    const chainScore = calculateScore(currentChain.length);
    setScore((prev) => prev + chainScore);

    const newBoard = removeChainAndRefill(board, currentChain);
    setBoard(newBoard);
    setCurrentChain([]);

    const newMovesLeft = movesLeft - 1;
    setMovesLeft(newMovesLeft);

    if (newMovesLeft <= 0) {
      setGameOver(true);
    }
  }, [board, currentChain, movesLeft]);

  return {
    board,
    score,
    movesLeft,
    gameOver,
    currentChain,
    startGame,
    restartGame,
    startChain,
    extendChain,
    endChain,
  };
}
