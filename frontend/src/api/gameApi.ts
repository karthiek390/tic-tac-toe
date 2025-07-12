// frontend/src/api/gameApi.ts

const API_URL = 'http://localhost:5000/api';

type Player = 'X' | 'O' | null;
type Board = Player[][];

export async function startNewGame() {
  const res = await fetch(`${API_URL}/new-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}

export async function sendMove(board: Board, row: number, col: number, currentPlayer: string) {
  const res = await fetch(`${API_URL}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ board, row, col, currentPlayer }),
  });
  return res.json();
}
