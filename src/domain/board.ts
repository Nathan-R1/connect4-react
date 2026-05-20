import { Board, Player, COLS, ROWS } from './types';

export function createBoard(): Board {
  return Array.from({ length: COLS }, () => Array(ROWS).fill(Player.None));
}

export function cloneBoard(board: Board): Board {
  return board.map(col => [...col]);
}

export function findNextFreeRow(board: Board, col: number): number | null {
  for (let row = 0; row < ROWS; row++) {
    if (board[col][row] === Player.None) {
      return row;
    }
  }
  return null;
}

export function placePiece(board: Board, col: number, player: Player): Board {
  const row = findNextFreeRow(board, col);
  if (row === null) return board;
  const next = cloneBoard(board);
  next[col][row] = player;
  return next;
}

export function isValidMove(board: Board, col: number): boolean {
  if (col < 0 || col >= COLS) return false;
  return board[col][ROWS - 1] === Player.None;
}

export function isBoardFull(board: Board): boolean {
  for (let col = 0; col < COLS; col++) {
    if (board[col][ROWS - 1] === Player.None) return false;
  }
  return true;
}
