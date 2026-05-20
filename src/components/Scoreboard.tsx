import { Player, PlayerColor } from '../domain/types';

interface ScoreboardProps {
  scores: [number, number];
  round: number;
  player1Color: PlayerColor;
  player2Color: PlayerColor;
  status: string;
  currentPlayer: Player;
  winner: Player | null;
}

const playerGradients: Record<string, string> = {
  Red: '#dc143c',
  Green: '#228b22',
  Blue: '#1e90ff',
  Yellow: '#ffd700',
  Orange: '#ff8c00',
  Purple: '#8b00ff',
  Gray: '#808080',
  Pink: '#ff1493',
};

export function Scoreboard({
  scores,
  round,
  player1Color,
  player2Color,
  status,
  currentPlayer,
  winner,
}: ScoreboardProps) {
  const getStatusText = () => {
    if (status === 'won') {
      return winner === Player.Player1
        ? `${player1Color} Wins!`
        : `${player2Color} Wins!`;
    }
    if (status === 'draw') return 'Draw!';
    const color = currentPlayer === Player.Player1 ? player1Color : player2Color;
    return `${color}'s turn`;
  };

  return (
    <>
      <div className="scoreboard">
        <div className="player-score">
          <span className="name" style={{ color: playerGradients[player1Color] }}>
            {player1Color}
          </span>
          <span className="score">{scores[0]}</span>
        </div>
        <div className="round-display">Round {round}</div>
        <div className="player-score">
          <span className="name" style={{ color: playerGradients[player2Color] }}>
            {player2Color}
          </span>
          <span className="score">{scores[1]}</span>
        </div>
      </div>
      <div className="status-bar">{getStatusText()}</div>
    </>
  );
}
