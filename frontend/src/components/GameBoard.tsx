
import React, { useState, useEffect } from 'react';
import GameCell from './GameCell';
import GameStatus from './GameStatus';

type Player = 'X' | 'O' | null;
type Board = Player[][];

const GameBoard = () => {
  const [board, setBoard] = useState<Board>(() => 
    Array(3).fill(null).map(() => Array(3).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningCells, setWinningCells] = useState<number[][]>([]);
  const [gameEnded, setGameEnded] = useState(false);

  const checkWinner = (board: Board): { winner: Player; winningCells: number[][] } => {
    const size = board.length;
    
    // Check rows
    for (let i = 0; i < size; i++) {
      if (board[i][0] && board[i].every(cell => cell === board[i][0])) {
        return { 
          winner: board[i][0], 
          winningCells: Array(size).fill(0).map((_, j) => [i, j])
        };
      }
    }
    
    // Check columns
    for (let j = 0; j < size; j++) {
      if (board[0][j] && board.every(row => row[j] === board[0][j])) {
        return { 
          winner: board[0][j], 
          winningCells: Array(size).fill(0).map((_, i) => [i, j])
        };
      }
    }
    
    // Check main diagonal
    if (board[0][0] && board.every((row, i) => row[i] === board[0][0])) {
      return { 
        winner: board[0][0], 
        winningCells: Array(size).fill(0).map((_, i) => [i, i])
      };
    }
    
    // Check anti-diagonal
    if (board[0][size - 1] && board.every((row, i) => row[size - 1 - i] === board[0][size - 1])) {
      return { 
        winner: board[0][size - 1], 
        winningCells: Array(size).fill(0).map((_, i) => [i, size - 1 - i])
      };
    }
    
    return { winner: null, winningCells: [] };
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || gameEnded) return;
    
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    
    const { winner: newWinner, winningCells: newWinningCells } = checkWinner(newBoard);
    
    if (newWinner) {
      setWinner(newWinner);
      setWinningCells(newWinningCells);
      setGameEnded(true);
    } else if (newBoard.every(row => row.every(cell => cell !== null))) {
      setGameEnded(true);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningCells([]);
    setGameEnded(false);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <GameStatus 
        currentPlayer={currentPlayer}
        winner={winner}
        gameEnded={gameEnded}
        onReset={resetGame}
      />
      
      <div className="relative">
        {/* 3D Board Container */}
        <div className="p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl border border-yellow-500/20 transform-gpu">
          {/* Glow effect for the board */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-blue-500/10 rounded-2xl blur-xl"></div>
          
          {/* Game Grid */}
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
        
        {/* Winner celebration effect */}
        {winner && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 rounded-2xl animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
