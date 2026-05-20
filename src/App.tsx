import { useState } from 'react';
import { Board } from './components/Board';
import { Scoreboard } from './components/Scoreboard';
import { SettingsPanel } from './components/SettingsPanel';
import { useConnectFour } from './hooks/useConnectFour';
import './styles/board.css';

export default function App() {
  const { state, dispatch, handleColumnClick } = useConnectFour();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const canInteract =
    state.status === 'playing' &&
    !(state.mode === 'pve' && state.currentPlayer === 2) &&
    state.mode !== 'aivai';

  return (
    <div className="app">
      <h1 className="title">Connect Four</h1>

      <div className="game-area">
        <Scoreboard
          scores={state.scores}
          round={state.round}
          player1Color={state.player1Color}
          player2Color={state.player2Color}
          status={state.status}
          currentPlayer={state.currentPlayer}
          winner={state.winner}
        />

        <Board
          board={state.board}
          currentPlayer={state.currentPlayer}
          winningCells={state.winningCells}
          lastDropCol={state.lastDropCol}
          lastDropRow={state.lastDropRow}
          disabled={!canInteract}
          player1Color={state.player1Color}
          player2Color={state.player2Color}
          onColumnClick={handleColumnClick}
        />

        <div className="buttons-row">
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'RESTART' })}>
            Restart
          </button>
          <button className="btn" onClick={() => setSettingsOpen(true)}>
            Settings
          </button>
        </div>
      </div>

      {settingsOpen && (
        <SettingsPanel state={state} dispatch={dispatch} onClose={() => setSettingsOpen(false)} />
      )}
    </div>
  );
}
