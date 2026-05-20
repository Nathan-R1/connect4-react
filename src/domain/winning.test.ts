import { describe, it, expect } from 'vitest';
import { checkWin } from './winning';
import { Player, COLS, ROWS } from './types';
import { createBoard } from './board';

function setBoard(cells: [number, number, Player][]): Player[][] {
  const board = createBoard();
  for (const [c, r, p] of cells) {
    board[c][r] = p;
  }
  return board;
}

describe('checkWin', () => {
  it('detects horizontal win', () => {
    const board = setBoard([
      [0, 0, Player.Player1],
      [1, 0, Player.Player1],
      [2, 0, Player.Player1],
    ]);
    const result = checkWin(board, 3, 0, Player.Player1);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
  });

  it('detects vertical win', () => {
    const board = setBoard([
      [0, 0, Player.Player1],
      [0, 1, Player.Player1],
      [0, 2, Player.Player1],
    ]);
    const result = checkWin(board, 0, 3, Player.Player1);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
  });

  it('detects diagonal / win', () => {
    const board = setBoard([
      [0, 0, Player.Player1],
      [1, 1, Player.Player1],
      [2, 2, Player.Player1],
    ]);
    const result = checkWin(board, 3, 3, Player.Player1);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
  });

  it('detects diagonal \\ win', () => {
    const board = setBoard([
      [3, 0, Player.Player1],
      [2, 1, Player.Player1],
      [1, 2, Player.Player1],
    ]);
    const result = checkWin(board, 0, 3, Player.Player1);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(4);
  });

  it('returns null for no win', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    board[1][0] = Player.Player1;
    board[3][0] = Player.Player1;
    const result = checkWin(board, 2, 0, Player.Player1);
    expect(result).toBeNull();
  });
});
