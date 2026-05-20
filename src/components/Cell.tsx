import { Player } from '../domain/types';

interface CellProps {
  player: Player;
  isWinning: boolean;
  isDrop: boolean;
  player1Color: string;
  player2Color: string;
}

const playerGradients: Record<string, [string, string]> = {
  Red: ['#ff8a8a', '#dc143c'],
  Green: ['#8aff8a', '#228b22'],
  Blue: ['#8ab4ff', '#1e90ff'],
  Yellow: ['#fff48a', '#ffd700'],
  Orange: ['#ffb87a', '#ff8c00'],
  Purple: ['#c87aff', '#8b00ff'],
  Gray: ['#cccccc', '#808080'],
  Pink: ['#ff8ab4', '#ff1493'],
};

const noneGradients: Record<string, [string, string]> = {
  Red: ['#3a1a1a', '#1a1a2e'],
  Green: ['#1a3a1a', '#1a1a2e'],
  Blue: ['#1a1a3a', '#1a1a2e'],
  Yellow: ['#3a3a1a', '#1a1a2e'],
  Orange: ['#3a2a1a', '#1a1a2e'],
  Purple: ['#2a1a3a', '#1a1a2e'],
  Gray: ['#2a2a2a', '#1a1a2e'],
  Pink: ['#3a1a2a', '#1a1a2e'],
};

export function Cell({ player, isWinning, isDrop, player1Color, player2Color }: CellProps) {
  const grad =
    player === Player.Player1
      ? playerGradients[player1Color]
      : playerGradients[player2Color];
  const noneGrad = noneGradients[player1Color];

  const style: React.CSSProperties =
    player !== Player.None
      ? {
          background: `radial-gradient(circle at 35% 35%, ${grad[0]}, ${grad[1]})`,
          boxShadow: `inset 0 -3px 6px rgba(0,0,0,0.3), 0 0 6px ${grad[1]}66`,
        }
      : {
          background: `radial-gradient(circle at 35% 35%, ${noneGrad[0]}, ${noneGrad[1]})`,
        };

  const className = [
    'cell',
    player === Player.Player1 ? 'player-1' : '',
    player === Player.Player2 ? 'player-2' : '',
    isWinning ? 'winning' : '',
    isDrop ? 'drop' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={className} style={style} />;
}
