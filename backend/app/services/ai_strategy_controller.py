"""
AI Strategy Controller for Tic-Tac-Toe

Defines a registry of pluggable AI strategies, each implementing a `choose_move(board, player)` method.
"""

import random
import math
from copy import deepcopy

class RandomStrategy:
    """Picks a random empty cell."""
    @staticmethod
    def choose_move(board, player):
        n = len(board)
        empty = [(i, j) for i in range(n) for j in range(n) if board[i][j] is None]
        return random.choice(empty) if empty else None

class MinimaxStrongStrategy:
    """Perfect minimax AI (plays optimally as 'O')."""
    @staticmethod
    def choose_move(board, player):
        n = len(board)
        best_val = -math.inf
        best_move = None

        def evaluate(bd):
            for i in range(n):
                for j in range(n):
                    if bd[i][j] is not None:
                        p = bd[i][j]
                        if MinimaxStrongStrategy._check_winner_for_eval(bd, i, j, p):
                            return 1 if p == "O" else -1
            return 0

        def minimax(bd, is_max, alpha, beta):
            score = evaluate(bd)
            if score == 1 or score == -1 or all(cell is not None for row in bd for cell in row):
                return score
            if is_max:
                best = -math.inf
                for i in range(n):
                    for j in range(n):
                        if bd[i][j] is None:
                            bd[i][j] = "O"
                            val = minimax(deepcopy(bd), False, alpha, beta)
                            best = max(best, val)
                            alpha = max(alpha, best)
                            bd[i][j] = None
                            if beta <= alpha:
                                break
                return best
            else:
                best = math.inf
                for i in range(n):
                    for j in range(n):
                        if bd[i][j] is None:
                            bd[i][j] = "X"
                            val = minimax(deepcopy(bd), True, alpha, beta)
                            best = min(best, val)
                            beta = min(beta, best)
                            bd[i][j] = None
                            if beta <= alpha:
                                break
                return best

        for i in range(n):
            for j in range(n):
                if board[i][j] is None:
                    board[i][j] = "O"
                    move_val = minimax(board, False, -math.inf, math.inf)
                    board[i][j] = None
                    if move_val > best_val:
                        best_val = move_val
                        best_move = (i, j)
        return best_move

    @staticmethod
    def _check_winner_for_eval(board, row, col, player):
        n = len(board)
        return (
            all(board[row][i] == player for i in range(n)) or
            all(board[i][col] == player for i in range(n)) or
            (row == col and all(board[i][i] == player for i in range(n))) or
            (row + col == n - 1 and all(board[i][n - 1 - i] == player for i in range(n)))
        )

class CenterFirstStrategy:
    """Picks center if available, else random."""
    @staticmethod
    def choose_move(board, player):
        n = len(board)
        center = n // 2
        if n % 2 == 1 and board[center][center] is None:
            return (center, center)
        # else random
        return RandomStrategy.choose_move(board, player)

class MinimaxSoftStrategy:
    """Imperfect minimax (randomly makes 1–2 mistakes)."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class CornerFirstStrategy:
    """Starts in corners, then optimal."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class MirrorUserStrategy:
    """Mimics user's opening patterns (placeholder)."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class TrapSetterStrategy:
    """Prefers fork/bait setups."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class BlockFocusStrategy:
    """Only blocks user, never tries to win."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class LastMoveRepeaterStrategy:
    """Repeats recent successful user patterns."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

class EarlyGameRandomStrategy:
    """Random first 2 moves, then minimax."""
    @staticmethod
    def choose_move(board, player):
        # TODO: Implement (stub for now)
        return RandomStrategy.choose_move(board, player)

# Registry mapping strategy_id to strategy class
STRATEGY_REGISTRY = {
    "random": RandomStrategy,
    "minimax_strong": MinimaxStrongStrategy,
    "center_first": CenterFirstStrategy,
    "minimax_soft": MinimaxSoftStrategy,
    "corner_first": CornerFirstStrategy,
    "mirror_user": MirrorUserStrategy,
    "trap_setter": TrapSetterStrategy,
    "block_focus": BlockFocusStrategy,
    "last_move_repeater": LastMoveRepeaterStrategy,
    "early_game_random": EarlyGameRandomStrategy,
}

class StrategyController:
    """
    Controller for retrieving and invoking AI strategies by strategy_id.
    """
    @staticmethod
    def get_strategy(strategy_id):
        """
        Returns the strategy class for the given strategy_id.
        """
        return STRATEGY_REGISTRY.get(strategy_id, RandomStrategy)
