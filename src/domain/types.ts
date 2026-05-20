export const COLS = 7;
export const ROWS = 6;

export enum Player {
  None = 0,
  Player1 = 1,
  Player2 = 2,
}

export type Board = Player[][];

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'pvp' | 'pve' | 'aivai';

export type GameStatus = 'playing' | 'won' | 'draw';

export const PLAYER_COLORS = [
  'Red',
  'Green',
  'Blue',
  'Yellow',
  'Orange',
  'Purple',
  'Gray',
  'Pink',
] as const;

export type PlayerColor = (typeof PLAYER_COLORS)[number];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winningCells: [number, number][] | null;
  scores: [number, number];
  round: number;
  mode: GameMode;
  aiDifficulty: Difficulty;
  aiDelay: boolean;
  accelerateAI: boolean;
  aiCycle: boolean;
  player1Color: PlayerColor;
  player2Color: PlayerColor;
  lastDropCol: number | null;
  lastDropRow: number | null;
}

export type GameAction =
  | { type: 'PLACE_PIECE'; col: number; row: number }
  | { type: 'ANIMATION_DONE' }
  | { type: 'RESTART' }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty }
  | { type: 'RESET_SCORES' }
  | { type: 'SET_PLAYER1_COLOR'; color: PlayerColor }
  | { type: 'SET_PLAYER2_COLOR'; color: PlayerColor }
  | { type: 'TOGGLE_AI_DELAY' }
  | { type: 'TOGGLE_ACCELERATE_AI' }
  | { type: 'TOGGLE_AI_CYCLE' }
  | { type: 'SET_WINNER'; winner: Player; cells: [number, number][] };

export function otherPlayer(p: Player): Player {
  return p === Player.Player1 ? Player.Player2 : Player.Player1;
}
