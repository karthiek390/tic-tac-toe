import React, { useState, useEffect } from 'react';
import GameCell from './GameCell';
import GameStatus from './GameStatus';
import { startNewGame, sendMove,logGame  } from '../api/gameApi';


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
  const [showStartModal, setShowStartModal] = useState(true);
  const [selectedStarter, setSelectedStarter] = useState<'X' | 'O'>('X');


  // Trigger game reset only after player selection is made
  useEffect(() => {
    if (!showStartModal) {
      resetGame(selectedStarter);
    }
  }, [showStartModal]);


// useEffect(() => {
//   if (gameEnded) {
//     const insights = generateFeedback();
//     console.log("🧠 Post-game insights:", insights);
//   }
// }, [gameEnded]);

useEffect(() => {
  if (gameEnded) {
    const insights = generateFeedback();

    console.log("🎯 Game ended. Preparing to log:");
    console.log("🧠 Insights:", insights);
    console.log("📜 Move History:", moveHistory);

    logGame(moveHistory, insights)
      .then(() => console.log("✅ Game log sent"))
      .catch((err) => console.error("❌ Failed to log game:", err));
  }
}, [gameEnded]);


const handlePlayerSelection = (starter: 'X' | 'O') => {
    setSelectedStarter(starter);
    setShowStartModal(false);
  };

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


  const resetGame = async (starter: 'X' | 'O') => {
    console.log('Resetting game with starter:', starter);
    try {
      const data = await startNewGame(starter);
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setWinner(data.winner);
      setWinningCells(data.winningCells);
      setGameEnded(data.gameEnded);
      setMoveHistory([]);
    } catch (err) {
      console.error('Failed to reset game:', err);
    }
  };


  const isWinningCell = (row: number, col: number) => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };

  const generateFeedback = () => {
  const feedback: string[] = [];


  // Detect center avoidance
  const centerMoves = moveHistory.filter(
    move => move.move.row === 1 && move.move.col === 1
  );
  if (centerMoves.length === 0) {
    feedback.push("You didn’t take the center even once — that’s usually a strong early move.");
  }


  // Detect first move preference
  const firstMove = moveHistory[0];
  if (firstMove && firstMove.currentPlayer === 'X') {
    if (
      (firstMove.move.row === 0 || firstMove.move.row === 2) &&
      (firstMove.move.col === 0 || firstMove.move.col === 2)
    ) {
      feedback.push("Nice! You started in a corner, which is a strong opening.");
    } else if (firstMove.move.row === 1 && firstMove.move.col === 1) {
      feedback.push("Smart opening move! Taking the center gives you control.");
    } else {
      feedback.push("Your first move wasn’t ideal — center or corners are better.");
    }
  }


  return feedback;
};

  if (showStartModal) {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-white text-center">
        <h2 className="text-xl font-bold mb-4">Who should start the game?</h2>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
            onClick={() => handlePlayerSelection('X')}
          >
            I’ll start (X)
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
            onClick={() => handlePlayerSelection('O')}
          >
            You start (O)
          </button>
        </div>
      </div>
    </div>
  );
}

if (board.length === 0) {
  return <div className="text-white text-lg mt-10">Loading game...</div>;
}

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Modal to choose who starts */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-white text-center">
            <h2 className="text-xl font-bold mb-4">Who should start the game?</h2>
            <div className="space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                onClick={() => handlePlayerSelection('X')}
              >
                I’ll start (X)
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded"
                onClick={() => handlePlayerSelection('O')}
              >
                You start (O)
              </button>
            </div>
          </div>
        </div>
      )}
      <GameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        gameEnded={gameEnded}
        onReset={() => {
          setShowStartModal(true);
          setSelectedStarter(null);
        }}
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
      {/*
<pre className="text-white text-sm mt-4 max-w-2xl overflow-x-auto">
  {JSON.stringify(moveHistory, null, 2)}
</pre>
*/}
{/*
{gameEnded && (
  <div className="mt-6 text-white bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2">🧠 Post-Game Feedback</h2>
    <ul className="list-disc ml-6 space-y-1 text-yellow-300">
      {generateFeedback().map((line, idx) => (
        <li key={idx}>{line}</li>
      ))}
    </ul>
  </div>
)}
*/}
    </div>
  );
};

export default GameBoard;
