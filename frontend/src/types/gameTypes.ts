export type Player = 'X' | 'O' | null;
export type Board = Player[][];

export type MoveRecord = {
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
