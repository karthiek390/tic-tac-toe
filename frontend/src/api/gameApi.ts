// frontend/src/api/gameApi.ts

const API_URL = 'http://localhost:5000/api';

export type Player = 'X' | 'O' | null;
export type Board = Player[][];

export async function startNewGame() {
  const res = await fetch(`${API_URL}/new-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to start a new game');
  }

  return await res.json();
}

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
