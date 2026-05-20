interface ColumnHeaderProps {
  col: number;
  disabled: boolean;
  onClick: () => void;
}

export function ColumnHeader({ col, disabled, onClick }: ColumnHeaderProps) {
  return (
    <div
      className={`column-header ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      <span className="column-arrow">▼</span>
    </div>
  );
}
