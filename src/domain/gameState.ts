import {
  GameState,
  GameAction,
  Player,
  GameMode,
  Difficulty,
  PlayerColor,
  COLS,
  ROWS,
} from './types';
import { createBoard, findNextFreeRow, isBoardFull } from './board';
import { checkWin } from './winning';

export function createInitialState(): GameState {
  return {
    board: createBoard(),
    currentPlayer: Player.Player1,
    status: 'playing',
    winner: null,
    winningCells: null,
    scores: [0, 0],
    round: 1,
    mode: 'pvp',
    aiDifficulty: 'hard',
    aiDelay: true,
    accelerateAI: false,
    aiCycle: false,
    player1Color: 'Red',
    player2Color: 'Blue',
    lastDropCol: null,
    lastDropRow: null,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLACE_PIECE': {
      const { col, row } = action;
      const newBoard = state.board.map(c => [...c]);
      newBoard[col][row] = state.currentPlayer;
      const winResult = checkWin(newBoard, col, row, state.currentPlayer);
      if (winResult) {
        const newScores: [number, number] = [...state.scores];
        if (state.currentPlayer === Player.Player1) newScores[0]++;
        else newScores[1]++;
        return {
          ...state,
          board: newBoard,
          status: 'won',
          winner: state.currentPlayer,
          winningCells: winResult,
          scores: newScores,
          lastDropCol: col,
          lastDropRow: row,
        };
      }
      if (isBoardFull(newBoard)) {
        return {
          ...state,
          board: newBoard,
          status: 'draw',
          winner: null,
          winningCells: null,
          lastDropCol: col,
          lastDropRow: row,
        };
      }
      const nextPlayer =
        state.currentPlayer === Player.Player1 ? Player.Player2 : Player.Player1;
      return {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        lastDropCol: col,
        lastDropRow: row,
      };
    }

    case 'ANIMATION_DONE': {
      return {
        ...state,
        lastDropCol: null,
        lastDropRow: null,
      };
    }

    case 'SET_WINNER': {
      const newScores: [number, number] = [...state.scores];
      if (action.winner === Player.Player1) newScores[0]++;
      else newScores[1]++;
      return {
        ...state,
        status: 'won',
        winner: action.winner,
        winningCells: action.cells,
        scores: newScores,
      };
    }

    case 'RESTART': {
      const newRound = state.round + 1;
      if (state.mode === 'aivai' && state.aiCycle && state.status === 'draw') {
        return {
          ...state,
          board: createBoard(),
          currentPlayer: Player.Player1,
          status: 'playing',
          winner: null,
          winningCells: null,
          round: newRound,
          lastDropCol: null,
          lastDropRow: null,
        };
      }
      return {
        ...state,
        board: createBoard(),
        currentPlayer: Player.Player1,
        status: 'playing',
        winner: null,
        winningCells: null,
        round: newRound,
        lastDropCol: null,
        lastDropRow: null,
      };
    }

    case 'SET_MODE': {
      return {
        ...state,
        mode: action.mode,
        board: createBoard(),
        currentPlayer: Player.Player1,
        status: 'playing',
        winner: null,
        winningCells: null,
        lastDropCol: null,
        lastDropRow: null,
      };
    }

    case 'SET_DIFFICULTY': {
      return {
        ...state,
        aiDifficulty: action.difficulty,
      };
    }

    case 'RESET_SCORES': {
      return {
        ...state,
        scores: [0, 0],
        round: 1,
      };
    }

    case 'SET_PLAYER1_COLOR': {
      return {
        ...state,
        player1Color: action.color,
      };
    }

    case 'SET_PLAYER2_COLOR': {
      return {
        ...state,
        player2Color: action.color,
      };
    }

    case 'TOGGLE_AI_DELAY': {
      return {
        ...state,
        aiDelay: !state.aiDelay,
      };
    }

    case 'TOGGLE_ACCELERATE_AI': {
      return {
        ...state,
        accelerateAI: !state.accelerateAI,
      };
    }

    case 'TOGGLE_AI_CYCLE': {
      return {
        ...state,
        aiCycle: !state.aiCycle,
      };
    }

    default:
      return state;
  }
}
