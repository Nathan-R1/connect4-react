import { useState } from 'react';
import {
  GameState,
  GameAction,
  GameMode,
  Difficulty,
  PlayerColor,
  PLAYER_COLORS,
} from '../domain/types';

interface SettingsPanelProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  onClose: () => void;
}

export function SettingsPanel({ state, dispatch, onClose }: SettingsPanelProps) {
  const [p1Color, setP1Color] = useState(state.player1Color);
  const [p2Color, setP2Color] = useState(state.player2Color);
  const colorError = p1Color === p2Color;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="setting-row">
          <label>Game Mode</label>
          <select
            value={state.mode}
            onChange={(e) => dispatch({ type: 'SET_MODE', mode: e.target.value as GameMode })}
          >
            <option value="pvp">PvP</option>
            <option value="pve">PvE</option>
            <option value="aivai">AI vs AI</option>
          </select>
        </div>

        {state.mode !== 'pvp' && (
          <div className="setting-row">
            <label>AI Difficulty</label>
            <select
              value={state.aiDifficulty}
              onChange={(e) =>
                dispatch({ type: 'SET_DIFFICULTY', difficulty: e.target.value as Difficulty })
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        )}

        <div className="setting-row">
          <label>{state.mode === 'pvp' ? 'Player 1' : 'You'}</label>
          <div className="color-picker-row">
            <div className="color-swatch" style={{ background: p1Color.toLowerCase() }} />
            <select
              value={p1Color}
              onChange={(e) => {
                const c = e.target.value as PlayerColor;
                setP1Color(c);
                dispatch({ type: 'SET_PLAYER1_COLOR', color: c });
              }}
            >
              {PLAYER_COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="setting-row">
          <label>{state.mode === 'pvp' ? 'Player 2' : 'Opponent'}</label>
          <div className="color-picker-row">
            <div className="color-swatch" style={{ background: p2Color.toLowerCase() }} />
            <select
              value={p2Color}
              onChange={(e) => {
                const c = e.target.value as PlayerColor;
                setP2Color(c);
                dispatch({ type: 'SET_PLAYER2_COLOR', color: c });
              }}
            >
              {PLAYER_COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {colorError && (
          <div style={{ color: '#e94560', fontSize: '0.8rem', textAlign: 'center' }}>
            Choose a different color
          </div>
        )}

        {state.mode === 'pve' && (
          <div className="setting-row">
            <label>Delay AI moves</label>
            <button
              className={`toggle ${state.aiDelay ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'TOGGLE_AI_DELAY' })}
            />
          </div>
        )}

        {state.mode === 'aivai' && (
          <>
            <div className="setting-row">
              <label>Infinite cycle</label>
              <button
                className={`toggle ${state.aiCycle ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_AI_CYCLE' })}
              />
            </div>
            <div className="setting-row">
              <label>Accelerate AI</label>
              <button
                className={`toggle ${state.accelerateAI ? 'active' : ''}`}
                onClick={() => dispatch({ type: 'TOGGLE_ACCELERATE_AI' })}
              />
            </div>
          </>
        )}

        <div className="buttons-row" style={{ justifyContent: 'center', marginTop: 8 }}>
          <button className="btn" onClick={() => dispatch({ type: 'RESET_SCORES' })}>
            Reset Scores
          </button>
        </div>

        <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Close
        </button>
      </div>
    </div>
  );
}
