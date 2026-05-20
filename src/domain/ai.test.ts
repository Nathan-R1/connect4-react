import { describe, it, expect } from 'vitest';
import { getAIMove } from './ai';
import { Player, COLS, ROWS } from './types';
import { createBoard } from './board';

describe('getAIMove', () => {
  it('returns a valid column (0-6)', () => {
    const board = createBoard();
    const col = getAIMove(board, Player.Player2, 'hard');
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(COLS);
  });

  it('takes winning move vertically', () => {
    const board = createBoard();
    board[3][0] = Player.Player2;
    board[3][1] = Player.Player2;
    board[3][2] = Player.Player2;
    const col = getAIMove(board, Player.Player2, 'hard');
    expect(col).toBe(3);
  });

  it('blocks opponent horizontal win', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    board[1][0] = Player.Player1;
    board[2][0] = Player.Player1;
    const col = getAIMove(board, Player.Player2, 'hard');
    expect(col).toBe(3);
  });

  it('blocks opponent vertical win', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    board[0][1] = Player.Player1;
    board[0][2] = Player.Player1;
    const col = getAIMove(board, Player.Player2, 'hard');
    expect(col).toBe(0);
  });

  it('returns a valid move when board is nearly full', () => {
    const board = createBoard();
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 1; r++) {
        board[c][r] = c % 2 === 0 ? Player.Player1 : Player.Player2;
      }
    }
    const col = getAIMove(board, Player.Player2, 'hard');
    expect(col).toBeGreaterThanOrEqual(0);
    expect(col).toBeLessThan(COLS);
  });

  it('returns a valid move on easy difficulty', () => {
    const board = createBoard();
    for (let i = 0; i < 10; i++) {
      const col = getAIMove(board, Player.Player2, 'easy');
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(COLS);
    }
  });
});
