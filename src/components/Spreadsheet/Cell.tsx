import styles from './Cell.module.css'


interface CellProps {
  value: any;
  isHeader?: boolean;
  isRowIndex?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  isHeader = false,
  isRowIndex = false,
  isSelected = false,
  onSelect,
}) => {
  const getClassName = (): string => {
    if (isHeader) return styles.headerCell;
    if (isRowIndex) return styles.rowIndexCell;

    return `${styles.cell} ${isSelected ? styles.selected : ''}`;
  }

  const displayValue = value !== null && value !== undefined ? String(value) : '';

  const handleClick = () => {
    if (!isHeader && !isRowIndex && onSelect) {
      onSelect()
    }
  }

  return (
    <div
      className={getClassName()}
      onClick={handleClick}
    >
      {displayValue}
    </div>
  )
}

export default Cell;
