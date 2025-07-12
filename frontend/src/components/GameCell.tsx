
import React, { useState } from 'react';

interface GameCellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  isWinning: boolean;
  disabled: boolean;
}

const GameCell: React.FC<GameCellProps> = ({ value, onClick, isWinning, disabled }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (value || disabled) return;
    
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
    onClick();
  };

  return (
    <div
      className={`
        relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 cursor-pointer
        transition-all duration-300 transform-gpu
        ${!value && !disabled ? 'hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/30' : ''}
        ${isWinning ? 'animate-pulse' : ''}
      `}
      onClick={handleClick}
    >
      {/* Cell Background */}
      <div className={`
        absolute inset-0 rounded-xl transition-all duration-300
        ${isWinning 
          ? 'bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/50' 
          : 'bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900'
        }
        ${!value && !disabled ? 'hover:from-gray-600 hover:via-gray-700 hover:to-gray-800' : ''}
        border-2 ${isWinning ? 'border-yellow-300' : 'border-gray-600'}
        ${isFlipping ? 'animate-[spin_0.6s_ease-in-out]' : ''}
      `}>
        {/* Inner glow effect */}
        <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-white/5 to-transparent"></div>
        
        {/* Hover indicator for empty cells */}
        {!value && !disabled && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-yellow-500/0 to-yellow-500/0 hover:from-yellow-500/10 hover:to-yellow-500/5 transition-all duration-300"></div>
        )}
      </div>
      
      {/* Cell Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {value && (
          <span className={`
            text-4xl md:text-5xl lg:text-6xl font-bold select-none
            transition-all duration-300 transform-gpu
            ${isFlipping ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}
            ${value === 'X' 
              ? (isWinning ? 'text-black' : 'text-yellow-400') 
              : (isWinning ? 'text-black' : 'text-blue-400')
            }
            ${isWinning ? 'drop-shadow-lg' : 'drop-shadow-sm'}
          `}>
            {value}
          </span>
        )}
        
        {/* Empty cell hint */}
        {!value && !disabled && (
          <div className="opacity-0 hover:opacity-20 transition-opacity duration-300">
            <div className="w-8 h-8 border-2 border-dashed border-gray-500 rounded-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCell;
