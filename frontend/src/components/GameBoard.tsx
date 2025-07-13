import React, { useState, useEffect } from 'react';
import GameCell from './GameCell';
import GameStatus from './GameStatus';
import { startNewGame, sendMove } from '../api/gameApi';


type Player = 'X' | 'O' | null;
type Board = Player[][];

type MoveRecord = {
  boardBeforeMove: Board;
  move: { row: number; col: number };
  currentPlayer: Player;
  resultAfterMove: {
    board: Board;
    winner: Player;
    gameEnded: boolean;
  };
  timestamp: string;
};


const GameBoard = () => {
  const [board, setBoard] = useState<Board>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningCells, setWinningCells] = useState<number[][]>([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);


  useEffect(() => {
  resetGame();
}, []);


  const checkWinner = (board: Board): { winner: Player; winningCells: number[][] } => {
    const size = board.length;
    
    for (let i = 0; i < size; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        return { 
          winner: board[i][0], 
          winningCells: Array(size).fill(0).map((_, j) => [i, j])
        };
      }
    }
    
    for (let j = 0; j < size; j++) {
      if (board[0][j] && board.every(row => row[j] === board[0][j])) {
        return { 
          winner: board[0][j], 
          winningCells: Array(size).fill(0).map((_, i) => [i, j])
        };
      }
    }

    if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
      return { 
        winner: board[0][0], 
        winningCells: Array(size).fill(0).map((_, i) => [i, i])
      };
    }

    if (board[0][size - 1] && board.every((row, i) => row[size - 1 - i] === board[0][size - 1])) {
      return { 
        winner: board[0][size - 1], 
        winningCells: Array(size).fill(0).map((_, i) => [i, size - 1 - i])
      };
    }

    return { winner: null, winningCells: [] };
  };

  const handleCellClick = async (row: number, col: number) => {
  if (board[row][col] || gameEnded) return;

  try {
  const boardBefore = board.map(r => [...r]); // shallow copy for history

  const data = await sendMove(board, row, col, currentPlayer);
  setBoard(data.board);
  setCurrentPlayer(data.currentPlayer);
  setWinner(data.winner);
  setWinningCells(data.winningCells);
  setGameEnded(data.gameEnded);

  if (currentPlayer === 'X') {
    setMoveHistory(prev => [
      ...prev,
      {
        boardBeforeMove: boardBefore,
        move: { row, col },
        currentPlayer,
        resultAfterMove: {
          board: data.board,
          winner: data.winner,
          gameEnded: data.gameEnded,
        },
        timestamp: new Date().toISOString(),
      },
    ]);
  }

} catch (err) {
  console.error('Move failed:', err);
}
};


  const resetGame = async () => {
  try {
    const data = await startNewGame();
    setBoard(data.board);
    setCurrentPlayer(data.currentPlayer);
    setWinner(data.winner);
    setWinningCells(data.winningCells);
    setGameEnded(data.gameEnded);
  } catch (err) {
    console.error('Failed to reset game:', err);
  }
};


  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  if (board.length === 0) {
  return <div className="text-white text-lg mt-10">Loading game...</div>;
}

  return (
    <div className="flex flex-col items-center space-y-8">
      <GameStatus 
        currentPlayer={currentPlayer}
        winner={winner}
        gameEnded={gameEnded}
        onReset={resetGame}
      />

      <div className="relative">
        <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl border border-yellow-500/20 transform-gpu">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-blue-500/10 rounded-2xl blur-xl"></div>

          <div className="relative grid grid-cols-3 gap-2 p-4 bg-black/40 rounded-xl backdrop-blur-sm">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <GameCell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  isWinning={isWinningCell(rowIndex, colIndex)}
                  disabled={gameEnded}
                />
              ))
            )}
          </div>
        </div>

        {winner && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 rounded-2xl animate-pulse"></div>
          </div>
        )}
      </div>
      <pre className="text-white text-sm mt-4 max-w-2xl overflow-x-auto">
  {JSON.stringify(moveHistory, null, 2)}
</pre>
    </div>
  );
};

export default GameBoard;
