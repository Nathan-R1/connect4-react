import { describe, it, expect } from 'vitest';
import { gameReducer, createInitialState } from './gameState';
import { Player } from './types';

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
