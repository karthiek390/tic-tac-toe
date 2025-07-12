
import React from 'react';
import { RotateCcw, Trophy, Users } from 'lucide-react';

interface GameStatusProps {
  currentPlayer: 'X' | 'O';
  winner: 'X' | 'O' | null;
  gameEnded: boolean;
  onReset: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ currentPlayer, winner, gameEnded, onReset }) => {
  const getStatusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center space-x-3">
          <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
          <span className="text-2xl font-bold">
            Player <span className={winner === 'X' ? 'text-yellow-400' : 'text-blue-400'}>{winner}</span> Wins!
          </span>
          <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
        </div>
      );
    }
    
    if (gameEnded) {
      return (
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-gray-400" />
          <span className="text-2xl font-bold text-gray-400">It's a Draw!</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-3">
        <Users className="w-6 h-6 text-gray-300" />
        <span className="text-xl">
          Player <span className={currentPlayer === 'X' ? 'text-yellow-400' : 'text-blue-400'}>{currentPlayer}</span>'s Turn
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-md space-y-4 sm:space-y-0 sm:space-x-6">
      {/* Status Message */}
      <div className="text-center sm:text-left">
        {getStatusMessage()}
      </div>
      
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 hover:from-yellow-600 hover:to-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105 text-white font-medium group"
      >
        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        <span>New Game</span>
      </button>
    </div>
  );
};

export default GameStatus;
