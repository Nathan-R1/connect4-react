import { Player } from '../domain/types';

const PIECE_CDN =
  'https://cdn.jsdelivr.net/gh/Nathan-R1/connect4-react@master/public/pieces';

interface CellProps {
  player: Player;
  isWinning: boolean;
  isDrop: boolean;
  player1Color: string;
  player2Color: string;
}

export function Cell({ player, isWinning, isDrop, player1Color, player2Color }: CellProps) {
  const isOccupied = player !== Player.None;
  const color = player === Player.Player1 ? player1Color : player2Color;

  const style: React.CSSProperties = isOccupied
    ? {
        backgroundImage: `url(${PIECE_CDN}/piece-${color.toLowerCase()}.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  const className = [
    'cell',
    player === Player.Player1 ? 'player-1' : '',
    player === Player.Player2 ? 'player-2' : '',
    isWinning ? 'winning' : '',
    isDrop && !isWinning ? 'drop' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={className} style={style} />;
}
