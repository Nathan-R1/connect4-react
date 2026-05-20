import { describe, it, expect } from 'vitest';
import { createBoard, cloneBoard, findNextFreeRow, placePiece, isValidMove, isBoardFull } from './board';
import { Player, COLS, ROWS } from './types';

describe('createBoard', () => {
  it('creates a 7x6 board of None', () => {
    const board = createBoard();
    expect(board).toHaveLength(COLS);
    expect(board[0]).toHaveLength(ROWS);
    expect(board[0][0]).toBe(Player.None);
    expect(board[6][5]).toBe(Player.None);
  });
});

describe('cloneBoard', () => {
  it('returns a deep copy', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    const cloned = cloneBoard(board);
    expect(cloned[0][0]).toBe(Player.Player1);
    cloned[0][0] = Player.Player2;
    expect(board[0][0]).toBe(Player.Player1);
  });
});

describe('findNextFreeRow', () => {
  it('returns 0 for empty column', () => {
    const board = createBoard();
    expect(findNextFreeRow(board, 0)).toBe(0);
  });

  it('returns next available row', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    board[0][1] = Player.Player2;
    expect(findNextFreeRow(board, 0)).toBe(2);
  });

  it('returns null for full column', () => {
    const board = createBoard();
    for (let r = 0; r < ROWS; r++) board[0][r] = Player.Player1;
    expect(findNextFreeRow(board, 0)).toBeNull();
  });
});

describe('placePiece', () => {
  it('places piece in correct row', () => {
    const board = createBoard();
    board[0][0] = Player.Player1;
    const next = placePiece(board, 0, Player.Player2);
    expect(next[0][1]).toBe(Player.Player2);
    expect(board[0][1]).toBe(Player.None);
  });

  it('returns same board if column full', () => {
    const board = createBoard();
    for (let r = 0; r < ROWS; r++) board[0][r] = Player.Player1;
    const next = placePiece(board, 0, Player.Player2);
    expect(next).toBe(board);
  });
});

describe('isValidMove', () => {
  it('returns true for empty column', () => {
    expect(isValidMove(createBoard(), 0)).toBe(true);
  });

  it('returns false for full column', () => {
    const board = createBoard();
    for (let r = 0; r < ROWS; r++) board[0][r] = Player.Player1;
    expect(isValidMove(board, 0)).toBe(false);
  });

  it('returns false for out of bounds', () => {
    expect(isValidMove(createBoard(), -1)).toBe(false);
    expect(isValidMove(createBoard(), 7)).toBe(false);
  });
});

describe('isBoardFull', () => {
  it('returns false for empty board', () => {
    expect(isBoardFull(createBoard())).toBe(false);
  });

  it('returns true for full board', () => {
    const board = createBoard();
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS; r++) {
        board[c][r] = Player.Player1;
      }
    }
    expect(isBoardFull(board)).toBe(true);
  });
});
