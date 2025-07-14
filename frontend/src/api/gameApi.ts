// frontend/src/api/gameApi.ts
import { Player, Board, MoveRecord } from '../types/gameTypes';

const API_URL = 'http://localhost:5000/api';

// export type Player = 'X' | 'O' | null;
// export type Board = Player[][];

// export async function startNewGame() {
//   const res = await fetch(`${API_URL}/new-game`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//   });

//   if (!res.ok) {
//     throw new Error('Failed to start a new game');
//   }

//   return await res.json();
// }

export const startNewGame = async (firstPlayer: 'X' | 'O') => {
  const response = await fetch(`${API_URL}/new-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ firstPlayer }),
  });

  if (!response.ok) {
    throw new Error('Failed to start new game');
  }

  return response.json();
};


export async function sendMove(
  board: Board,
  row: number,
  col: number,
  currentPlayer: 'X' | 'O'
) {
  const res = await fetch(`${API_URL}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board, row, col, currentPlayer }),
  });

  if (!res.ok) {
    throw new Error('Move rejected by server');
  }

  return await res.json();
}


export async function logGame(moveHistory: MoveRecord[], insights: string[]) {
  const res = await fetch(`${API_URL}/log-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moveHistory, insights }),
  });
  return res.json();
}
