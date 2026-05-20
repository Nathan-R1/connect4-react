import { Board, Player, COLS, ROWS, Difficulty } from './types';
import { cloneBoard } from './board';
import { checkWin } from './winning';

const COLUMN_SEARCH_ORDER = [3, 4, 2, 5, 1, 6, 0];

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

function oneOutOf(chance: number): boolean {
  return randomInt(chance) === 0;
}

function findTopPieceRow(board: Board, col: number): number {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[col][row] !== Player.None) {
      return row;
    }
  }
  return -1;
}

function findNextFreeRowForAI(board: Board, col: number): number {
  for (let row = 0; row < ROWS; row++) {
    if (board[col][row] === Player.None) {
      return row;
    }
  }
  return -1;
}

function wouldPlayerWinAt(board: Board, col: number, row: number, player: Player): boolean {
  const testBoard = cloneBoard(board);
  if (row < 0 || row >= ROWS) return false;
  testBoard[col][row] = player;
  return checkWin(testBoard, col, row, player) !== null;
}

function testFutureMoves(
  board: Board,
  significance: number,
  col: number,
  row: number,
  otherPlayer: Player,
  difficulty: Difficulty
): boolean {
  if (significance === 3 || difficulty === 'easy') return true;
  const aboveRow = row + 1;
  if (aboveRow >= ROWS) return true;
  if (wouldPlayerWinAt(board, col, aboveRow, otherPlayer)) {
    return false;
  }
  return true;
}

function checkForWinVertical(
  board: Board,
  player: Player,
  amount: number,
  findFirst: boolean,
  otherPlayer: Player,
  difficulty: Difficulty
): { column: number; wins: number } {
  const result = { column: -1, wins: 0 };
  if (amount === 0) return result;

  for (let col = 0; col < COLS; col++) {
    const topPiece = findTopPieceRow(board, col);
    if (topPiece < 0) continue;
    if (topPiece + 1 < amount) continue;
    if (ROWS - 1 - topPiece + amount < 4) continue;

    try {
      const match =
        board[col][topPiece] === player &&
        (amount < 2 || board[col][topPiece - 1] === player) &&
        (amount < 3 || board[col][topPiece - 2] === player);

      if (match) {
        const putRow = topPiece + 1;
        if (testFutureMoves(board, amount, col, putRow, otherPlayer, difficulty)) {
          result.column = col;
          if (findFirst) return result;
          result.wins++;
        }
      }
    } catch {
      // out of bounds
    }
  }
  return result;
}

function checkForWinHorizontal(
  board: Board,
  player: Player,
  amount: number,
  findFirst: boolean,
  otherPlayer: Player,
  difficulty: Difficulty
): { column: number; wins: number } {
  const result = { column: -1, wins: 0 };
  if (amount === 0) return result;

  for (let row = 0; row < ROWS; row++) {
    let count = 0;
    for (let col = 0; col < COLS; col++) {
      if (board[col][row] === player) count++;
    }
    if (count < amount || count >= COLS) continue;

    for (const x of COLUMN_SEARCH_ORDER) {
      if (board[x][row] !== Player.None) continue;

      let stableBeneath = false;
      try {
        stableBeneath = row === 0 || board[x][row - 1] !== Player.None;
      } catch {
        stableBeneath = true;
      }
      if (!stableBeneath) continue;

      let numberOfYourAdjacent = 0;
      let numberOfFreeAdjacent = 0;

      for (let direction = -1; direction <= 1; direction += 2) {
        let cap = false;
        for (let spaces = 1; spaces <= 3; spaces++) {
          try {
            const cx = x + spaces * direction;
            if (cx < 0 || cx >= COLS) break;
            if (board[cx][row] === player && !cap) {
              numberOfYourAdjacent++;
            } else if (board[cx][row] === Player.None) {
              cap = true;
              let blankUnder = false;
              try {
                blankUnder = row > 0 && board[cx][row - 1] === Player.None;
              } catch {
                // bottom
              }
              if (!blankUnder) {
                numberOfFreeAdjacent++;
              }
            } else {
              break;
            }
          } catch {
            break;
          }
        }
      }

      if (
        numberOfYourAdjacent >= amount &&
        numberOfFreeAdjacent + numberOfYourAdjacent >= 3
      ) {
        if (testFutureMoves(board, amount, x, row, otherPlayer, difficulty)) {
          result.column = x;
          if (findFirst) return result;
          result.wins++;
        }
      }
    }
  }
  return result;
}

function checkForWinDiagonal(
  board: Board,
  player: Player,
  amount: number,
  findFirst: boolean,
  otherPlayer: Player,
  difficulty: Difficulty
): { column: number; wins: number } {
  const result = { column: -1, wins: 0 };
  if (amount === 0) return result;

  for (const x of COLUMN_SEARCH_ORDER) {
    for (let y = 0; y < ROWS; y++) {
      let blankBelow = true;
      try {
        blankBelow = y === 0 || board[x][y - 1] !== Player.None;
      } catch {
        // bottom
      }
      if (!blankBelow) continue;
      if (board[x][y] !== Player.None) continue;

      let counter = 0;
      let blankCounter = 0;

      for (let direction = 1; direction >= -1; direction -= 2) {
        for (let multiplier = -1; multiplier <= 1; multiplier += 2) {
          let cap = false;
          for (let position = 1; position <= 3; position++) {
            try {
              const cx = x + position * multiplier;
              const cy = y + position * multiplier * direction;
              if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) break;
              if (board[cx][cy] === player && !cap) {
                counter++;
              } else if (board[cx][cy] === Player.None) {
                blankCounter++;
                cap = true;
              } else {
                break;
              }
            } catch {
              break;
            }
          }
          cap = false;
        }

        const enough = 1 + counter + blankCounter >= 4;
        if (counter >= amount && enough) {
          if (testFutureMoves(board, amount, x, y, otherPlayer, difficulty)) {
            result.column = x;
            if (findFirst) return result;
            result.wins++;
          }
        }
        counter = 0;
        blankCounter = 0;
      }
    }
  }
  return result;
}

function randomRow(
  board: Board,
  otherPlayer: Player,
  difficulty: Difficulty
): number {
  const attempts = 100;
  for (let i = 0; i < attempts; i++) {
    const col = randomInt(COLS);
    if (board[col][ROWS - 1] !== Player.None) continue;
    const row = findNextFreeRowForAI(board, col);
    if (row === -1) continue;
    if (testFutureMoves(board, 0, col, row, otherPlayer, difficulty)) {
      return col;
    }
  }
  for (let col = 0; col < COLS; col++) {
    if (board[col][ROWS - 1] === Player.None) return col;
  }
  return -1;
}

function checkForDoubleMoves(
  board: Board,
  thisPlayer: Player,
  otherPlayer: Player,
  difficulty: Difficulty
): number {
  for (const i of COLUMN_SEARCH_ORDER) {
    const fakeBoard = cloneBoard(board);
    const rowY = findNextFreeRowForAI(fakeBoard, i);
    if (rowY === -1) continue;
    fakeBoard[i][rowY] = thisPlayer;

    let wins = 0;
    const v = checkForWinVertical(fakeBoard, thisPlayer, 3, false, otherPlayer, difficulty);
    wins += v.wins;
    const h = checkForWinHorizontal(fakeBoard, thisPlayer, 3, false, otherPlayer, difficulty);
    wins += h.wins;
    const d = checkForWinDiagonal(fakeBoard, thisPlayer, 3, false, otherPlayer, difficulty);
    wins += d.wins;

    if (wins > 1) {
      return i;
    }
  }
  return -1;
}

export function getAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty
): number {
  const otherPlayer = aiPlayer === Player.Player1 ? Player.Player2 : Player.Player1;
  const isEasy = difficulty === 'easy';

  const tryMove = (check: () => { column: number; wins: number }): number | null => {
    const r = check();
    return r.column >= 0 ? r.column : null;
  };

  const checkEasyDiagonal = (fn: () => { column: number; wins: number }): number | null => {
    if (isEasy && !oneOutOf(100)) return null;
    return tryMove(fn);
  };

  // 1. Win if possible
  let col = tryMove(() => checkForWinVertical(board, aiPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = tryMove(() => checkForWinHorizontal(board, aiPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = checkEasyDiagonal(() => checkForWinDiagonal(board, aiPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;

  // 2. Block opponent wins
  col = checkEasyDiagonal(() => checkForWinVertical(board, otherPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = tryMove(() => checkForWinHorizontal(board, otherPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = checkEasyDiagonal(() => checkForWinDiagonal(board, otherPlayer, 3, true, otherPlayer, difficulty));
  if (col !== null) return col;

  // 3. Double-move detection (Hard only)
  if (difficulty === 'hard') {
    col = checkForDoubleMoves(board, aiPlayer, otherPlayer, difficulty);
    if (col !== -1) return col;
    col = checkForDoubleMoves(board, otherPlayer, aiPlayer, difficulty);
    if (col !== -1) return col;
  }

  // 4. Block opponent 2-in-a-rows
  col = checkEasyDiagonal(() => checkForWinHorizontal(board, otherPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = checkEasyDiagonal(() => checkForWinDiagonal(board, otherPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = tryMove(() => checkForWinVertical(board, otherPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;

  // 5. Build own 2-in-a-rows
  col = checkEasyDiagonal(() => checkForWinDiagonal(board, aiPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = tryMove(() => checkForWinHorizontal(board, aiPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;
  col = tryMove(() => checkForWinVertical(board, aiPlayer, 2, true, otherPlayer, difficulty));
  if (col !== null) return col;

  // 6. Random fallback
  return randomRow(board, otherPlayer, difficulty);
}
