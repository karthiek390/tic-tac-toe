import math
from copy import deepcopy
import random

class TicTacToe:
    def __init__(self, n):
        self.n = n
        self.board = [[None for _ in range(n)] for _ in range(n)]
        self.current_player = "X"
        self.winner = None

    def make_move(self, row, col, player):
        if self.board[row][col] is not None or player != self.current_player:
            return False
        self.board[row][col] = player

        if self.check_winner(row, col):
            self.winner = player
        elif self.is_draw():
            self.winner = "Draw"
        else:
            self.current_player = "O" if self.current_player == "X" else "X"
        return True

    def check_winner(self, row, col):
        b = self.board
        p = self.current_player
        n = self.n

        return (
            all(b[row][i] == p for i in range(n)) or
            all(b[i][col] == p for i in range(n)) or
            (row == col and all(b[i][i] == p for i in range(n))) or
            (row + col == n - 1 and all(b[i][n - 1 - i] == p for i in range(n)))
        )

    def is_draw(self):
        return all(cell is not None for row in self.board for cell in row)

    def get_status(self):
        if self.winner == "Draw":
            return "Draw"
        elif self.winner:
            return f"{self.winner} wins"
        return "Ongoing"

 # ---------- Minimax with Alpha-Beta Pruning ----------

    def evaluate(self, board):
        for i in range(self.n):
            for j in range(self.n):
                if board[i][j] is not None:
                    p = board[i][j]
                    if self._check_winner_for_eval(board, i, j, p):
                        return 1 if p == "O" else -1
        return 0

    def _check_winner_for_eval(self, board, row, col, player):
        n = self.n

        return (
            all(board[row][i] == player for i in range(n)) or
            all(board[i][col] == player for i in range(n)) or
            (row == col and all(board[i][i] == player for i in range(n))) or
            (row + col == n - 1 and all(board[i][n - 1 - i] == player for i in range(n)))
        )

    def minimax(self, board, depth, is_max, alpha, beta):
        score = self.evaluate(board)

        if score == 1 or score == -1 or self._is_full(board):
            return score

        if is_max:
            best = -math.inf
            for i in range(self.n):
                for j in range(self.n):
                    if board[i][j] is None:
                        board[i][j] = "O"
                        val = self.minimax(deepcopy(board), depth + 1, False, alpha, beta)
                        best = max(best, val)
                        alpha = max(alpha, best)
                        board[i][j] = None
                        if beta <= alpha:
                            break
            return best
        else:
            best = math.inf
            for i in range(self.n):
                for j in range(self.n):
                    if board[i][j] is None:
                        board[i][j] = "X"
                        val = self.minimax(deepcopy(board), depth + 1, True, alpha, beta)
                        best = min(best, val)
                        beta = min(beta, best)
                        board[i][j] = None
                        if beta <= alpha:
                            break
            return best

    def _is_full(self, board):
        return all(cell is not None for row in board for cell in row)

    def find_best_move(self):
        best_val = -math.inf
        best_move = None

        for i in range(self.n):
            for j in range(self.n):
                if self.board[i][j] is None:
                    self.board[i][j] = "O"
                    move_val = self.minimax(self.board, 0, False, -math.inf, math.inf)
                    self.board[i][j] = None
                    if move_val > best_val:
                        best_val = move_val
                        best_move = (i, j)

        return best_move