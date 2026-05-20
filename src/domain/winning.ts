import { Board, Player, COLS, ROWS } from './types';

export function checkWin(
  board: Board,
  col: number,
  row: number,
  player: Player
): [number, number][] | null {
  const directions: [number, number][] = [
    [1, 0],  // horizontal
    [0, 1],  // vertical
    [1, 1],  // diagonal /
    [1, -1], // diagonal \
  ];

  for (const [dc, dr] of directions) {
    const cells: [number, number][] = [[col, row]];

    for (const sign of [-1, 1]) {
      for (let step = 1; step < 4; step++) {
        const c = col + step * sign * dc;
        const r = row + step * sign * dr;
        if (c < 0 || c >= COLS || r < 0 || r >= ROWS) break;
        if (board[c][r] !== player) break;
        cells.push([c, r]);
      }
    }

    if (cells.length >= 4) {
      return cells;
    }
  }

  return null;
}
