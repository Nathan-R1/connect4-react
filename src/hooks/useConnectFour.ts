import { useReducer, useEffect, useCallback, useRef } from 'react';
import { GameState, GameAction, Player } from '../domain/types';
import { gameReducer, createInitialState } from '../domain/gameState';
import { findNextFreeRow } from '../domain/board';
import { getAIMove } from '../domain/ai';

function loadState(): GameState {
  try {
    const raw = localStorage.getItem('connect4_state');
    if (raw) {
      const saved = JSON.parse(raw);
      return { ...createInitialState(), ...saved, board: createInitialState().board };
    }
  } catch {}
  return createInitialState();
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(
      'connect4_state',
      JSON.stringify({
        mode: state.mode,
        aiDifficulty: state.aiDifficulty,
        aiDelay: state.aiDelay,
        accelerateAI: state.accelerateAI,
        aiCycle: state.aiCycle,
        player1Color: state.player1Color,
        player2Color: state.player2Color,
        scores: state.scores,
        round: state.round,
      })
    );
  } catch {}
}

export function useConnectFour() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadState);
  const aiTimerRef = useRef<number | null>(null);
  const prevPlayerRef = useRef(state.currentPlayer);
  const prevStatusRef = useRef(state.status);

  useEffect(() => {
    saveState(state);
  }, [state.mode, state.aiDifficulty, state.aiDelay, state.accelerateAI, state.aiCycle, state.player1Color, state.player2Color, state.scores, state.round]);

  const handleColumnClick = useCallback(
    (col: number) => {
      if (state.status !== 'playing') return;

      const isAiTurn =
        state.mode === 'pve' && state.currentPlayer === Player.Player2;
      const isAiVsAi =
        state.mode === 'aivai';

      if (isAiTurn || isAiVsAi) return;

      const row = findNextFreeRow(state.board, col);
      if (row === null) return;
      dispatch({ type: 'PLACE_PIECE', col, row });
    },
    [state.status, state.mode, state.currentPlayer, state.board]
  );

  useEffect(() => {
    if (state.status !== 'playing') {
      if (state.mode === 'aivai' && state.aiCycle) {
        const t = setTimeout(() => dispatch({ type: 'RESTART' }), 1500);
        return () => clearTimeout(t);
      }
      return;
    }

    const shouldAiMove =
      (state.mode === 'pve' && state.currentPlayer === Player.Player2) ||
      state.mode === 'aivai';

    if (!shouldAiMove) return;

    const delay = state.aiDelay ? (state.accelerateAI ? 200 : 500) : 50;

    aiTimerRef.current = window.setTimeout(() => {
      const aiPlayer = state.currentPlayer;
      const col = getAIMove(state.board, aiPlayer, state.aiDifficulty);
      if (col >= 0) {
        const row = findNextFreeRow(state.board, col);
        if (row !== null) {
          dispatch({ type: 'PLACE_PIECE', col, row });
        }
      }
    }, delay);

    return () => {
      if (aiTimerRef.current !== null) {
        clearTimeout(aiTimerRef.current);
      }
    };
  }, [state.currentPlayer, state.status, state.mode]);

  return { state, dispatch, handleColumnClick };
}
