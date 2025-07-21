import React, { useState, useEffect } from 'react';
import GameCell from './GameCell';
import GameStatus from './GameStatus';
import { startNewGame, sendMove, logGame } from '../api/gameApi';

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

// List of all strategy IDs in order
const STRATEGY_IDS: string[] = [
  'random',
  'minimax_strong',
  'minimax_soft',
  'center_first',
  'corner_first',
  'mirror_user',
  'trap_setter',
  'block_focus',
  'last_move_repeater',
  'early_game_random',
];

// Mapping from strategy_id to display name
const STRATEGY_DISPLAY_NAMES: Record<string, string> = {
  random: 'Random',
  minimax_strong: 'Minimax Strong',
  minimax_soft: 'Minimax Soft',
  center_first: 'Center First',
  corner_first: 'Corner First',
  mirror_user: 'Mirror User',
  trap_setter: 'Trap Setter',
  block_focus: 'Block Focus',
  last_move_repeater: 'Last Move Repeater',
  early_game_random: 'Early Game Random',
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

  // New state for cycling strategies
  const [gameNumber, setGameNumber] = useState(1);
  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(0);
  const [strategyId, setStrategyId] = useState<string>(STRATEGY_IDS[0]);
  const [strategyName, setStrategyName] = useState<string>(STRATEGY_DISPLAY_NAMES[STRATEGY_IDS[0]]);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // Track if all strategies have been played
  const allStrategiesPlayed = currentStrategyIndex >= STRATEGY_IDS.length;

  // Trigger game reset only after player selection is made
  useEffect(() => {
    if (!showStartModal && !allStrategiesPlayed) {
      resetGame(selectedStarter, STRATEGY_IDS[currentStrategyIndex], false);
    }
    // eslint-disable-next-line
  }, [showStartModal]);

  useEffect(() => {
    if (gameEnded && !allStrategiesPlayed) {
      const insights = generateFeedback();

      console.log("🎯 Game ended. Preparing to log:");
      console.log("🧠 Insights:", insights);
      console.log("📜 Move History:", moveHistory);

      logGame(moveHistory, insights)
        .then(() => console.log("✅ Game log sent"))
        .catch((err) => console.error("❌ Failed to log game:", err));

      // Show game over dialog if there are more strategies left
      setShowGameOverDialog(true);
    }
    // eslint-disable-next-line
  }, [gameEnded]);

  const handlePlayerSelection = async (starter: 'X' | 'O') => {
    // Always start with first strategy and game 1 after modal
    setGameNumber(1);
    setCurrentStrategyIndex(0);
    setStrategyId(STRATEGY_IDS[0]);
    setStrategyName(getStrategyDisplayName(STRATEGY_IDS[0]));
    setSelectedStarter(starter);
    setShowStartModal(false);

    // Start the new game after modal closes
    await resetGame(
      starter,
      STRATEGY_IDS[0],
      false // do not increment game number again in resetGame
    );
  };

  // Helper to get display name from strategy_id
  const getStrategyDisplayName = (id: string) =>
    STRATEGY_DISPLAY_NAMES[id] || id;

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

  /**
   * Resets the game and fetches a new board from the backend.
   * @param starter - Who starts the game ('X' or 'O')
   * @param strategy - The strategy_id to use for the new game
   * @param incrementGameNumber - Whether to increment the game number (true for replay, false for initial load)
   */
  const resetGame = async (
    starter: 'X' | 'O',
    strategy: string,
    incrementGameNumber: boolean = true
  ) => {
    if (allStrategiesPlayed) return;
    console.log('Resetting game with starter:', starter, 'strategy:', strategy);
    try {
      // Call backend with strategy_id
      const data = await startNewGame(starter, strategy);
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer || starter);
      setWinner(data.winner || null);
      setWinningCells(data.winningCells || []);
      setGameEnded(false);
      setMoveHistory([]);
      setStrategyId(data.strategy_id || strategy);
      setStrategyName(getStrategyDisplayName(data.strategy_id || strategy));
      if (incrementGameNumber) {
        setGameNumber(prev => prev + 1);
      }
      setShowGameOverDialog(false);
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

  // Game Over Dialog
  const GameOverDialog = () => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl shadow-xl text-white text-center">
        <h2 className="text-xl font-bold mb-4">
          Game over: {winner ? `${winner} wins.` : 'Draw.'} <br />
          {currentStrategyIndex < STRATEGY_IDS.length - 1
            ? 'Would you like to start a new game with the next strategy?'
            : 'All strategies completed.'}
        </h2>
        <div className="space-x-4">
          {currentStrategyIndex < STRATEGY_IDS.length - 1 && (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
              onClick={async () => {
                // Move to next strategy, increment game number, and start new game immediately
                const nextIndex = currentStrategyIndex + 1;
                setCurrentStrategyIndex(nextIndex);
                setGameNumber(prev => prev + 1);
                setShowGameOverDialog(false);
                setShowStartModal(false);
                // Start new game with next strategy
                const nextStrategy = STRATEGY_IDS[nextIndex];
                setStrategyId(nextStrategy);
                setStrategyName(getStrategyDisplayName(nextStrategy));
                await resetGame(selectedStarter, nextStrategy, false);
              }}
            >
              Yes, play next strategy
            </button>
          )}
          <button
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded"
            onClick={() => setShowGameOverDialog(false)}
          >
            No, stay here
          </button>
        </div>
      </div>
    </div>
  );

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
      {/* Display game number, strategy name, and progress above the board */}
      <div className="text-lg font-semibold text-yellow-300 mt-4">
        Game: {gameNumber} | Strategy: {strategyName} ({allStrategiesPlayed ? STRATEGY_IDS.length : currentStrategyIndex + 1} of {STRATEGY_IDS.length})
      </div>

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

      {/* Game status and reset */}
      <GameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        gameEnded={gameEnded}
        onReset={() => {
          // Always reset to first strategy and game 1, and show starter selection modal
          setGameNumber(1);
          setCurrentStrategyIndex(0);
          setStrategyId(STRATEGY_IDS[0]);
          setStrategyName(getStrategyDisplayName(STRATEGY_IDS[0]));
          setShowStartModal(true);
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

      {/* Game Over Dialog */}
      {showGameOverDialog && !allStrategiesPlayed && <GameOverDialog />}
      {/* If all strategies played, show a message */}
      {allStrategiesPlayed && (
        <div className="mt-8 text-xl text-green-400 font-bold">
          All strategies completed!
        </div>
      )}

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
