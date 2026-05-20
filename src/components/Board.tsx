import { Board as BoardType, Player, COLS, ROWS } from '../domain/types';
import { findNextFreeRow } from '../domain/board';
import { Cell } from './Cell';
import { ColumnHeader } from './ColumnHeader';

interface BoardProps {
  board: BoardType;
  currentPlayer: Player;
  winningCells: [number, number][] | null;
  lastDropCol: number | null;
  lastDropRow: number | null;
  disabled: boolean;
  player1Color: string;
  player2Color: string;
  onColumnClick: (col: number) => void;
}

export function Board({
  board,
  currentPlayer,
  winningCells,
  lastDropCol,
  lastDropRow,
  disabled,
  player1Color,
  player2Color,
  onColumnClick,
}: BoardProps) {
  const isWinningCell = (col: number, row: number) =>
    winningCells?.some(([c, r]) => c === col && r === row) ?? false;

  const isLastDrop = (col: number, row: number) =>
    lastDropCol === col && lastDropRow === row;

  return (
    <div className="board-container">
      <div className="board">
        {Array.from({ length: COLS }, (_, col) => (
          <ColumnHeader
            key={`h${col}`}
            col={col}
            disabled={disabled || findNextFreeRow(board, col) === null}
            onClick={() => onColumnClick(col)}
          />
        ))}
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const cellRow = ROWS - 1 - row;
            return (
              <Cell
                key={`${col}-${cellRow}`}
                player={board[col][cellRow]}
                isWinning={isWinningCell(col, cellRow)}
                isDrop={isLastDrop(col, cellRow)}
                player1Color={player1Color}
                player2Color={player2Color}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
