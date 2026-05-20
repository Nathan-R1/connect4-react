import { describe, it, expect, runTests } from './testRunner.js';

// board tests
import { createBoard, cloneBoard, findNextFreeRow, placePiece, isValidMove, isBoardFull } from './board.js';
import { Player, COLS, ROWS } from './types.js';

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

// winning tests
import { checkWin } from './winning.js';

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
    board[1][0] = Player.Player2;
    board[2][0] = Player.Player1;
    board[3][0] = Player.Player2;
    const result = checkWin(board, 0, 1, Player.Player1);
    expect(result).toBeNull();
  });
});

// AI tests
import { getAIMove } from './ai.js';

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

// gameState tests
import { gameReducer, createInitialState } from './gameState.js';

describe('gameReducer', () => {
  it('starts in playing state', () => {
    const state = createInitialState();
    expect(state.status).toBe('playing');
    expect(state.currentPlayer).toBe(Player.Player1);
  });

  it('handles PLACE_PIECE', () => {
    const state = createInitialState();
    const next = gameReducer(state, { type: 'PLACE_PIECE', col: 3, row: 0 });
    expect(next.board[3][0]).toBe(Player.Player1);
    expect(next.currentPlayer).toBe(Player.Player2);
  });

  it('switches back to player 1', () => {
    const state = createInitialState();
    const s1 = gameReducer(state, { type: 'PLACE_PIECE', col: 3, row: 0 });
    const s2 = gameReducer(s1, { type: 'PLACE_PIECE', col: 4, row: 0 });
    expect(s2.currentPlayer).toBe(Player.Player1);
  });

  it('detects a win', () => {
    const state = createInitialState();
    let s = state;
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 0, row: 0 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 1, row: 0 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 0, row: 1 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 1, row: 1 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 0, row: 2 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 1, row: 2 });
    s = gameReducer(s, { type: 'PLACE_PIECE', col: 0, row: 3 });
    expect(s.status).toBe('won');
    expect(s.winner).toBe(Player.Player1);
  });

  it('handles RESTART', () => {
    const state = createInitialState();
    const next = gameReducer(state, { type: 'RESTART' });
    expect(next.round).toBe(2);
    expect(next.status).toBe('playing');
  });

  it('handles SET_MODE', () => {
    const state = createInitialState();
    const next = gameReducer(state, { type: 'SET_MODE', mode: 'pve' });
    expect(next.mode).toBe('pve');
  });

  it('handles RESET_SCORES', () => {
    const state = { ...createInitialState(), scores: [5, 3] as [number, number] };
    const next = gameReducer(state, { type: 'RESET_SCORES' });
    expect(next.scores).toEqual([0, 0]);
    expect(next.round).toBe(1);
  });
});

runTests().then(({ ok, fail }) => {
  process.exit(fail > 0 ? 1 : 0);
});
