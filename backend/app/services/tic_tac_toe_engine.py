class TicTacToe:
    def __init__(self, n):
        self.n = n
        self.board = [["" for _ in range(n)] for _ in range(n)]
        self.current_player = "X"
        self.winner = None

    def make_move(self, row, col, player):
        if self.board[row][col] != "" or player != self.current_player:
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
        return all(cell != "" for row in self.board for cell in row)

    def get_status(self):
        if self.winner == "Draw":
            return "Draw"
        elif self.winner:
            return f"{self.winner} wins"
        return "Ongoing"
