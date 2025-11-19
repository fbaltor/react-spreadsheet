import styles from './Cell.module.css'


interface CellProps {
  value: any;
  isHeader?: boolean;
  isRowIndex?: boolean;
}

const Cell: React.FC<CellProps> = ({ value, isHeader = false, isRowIndex = false }) => {
  const cellClass = isHeader
    ? styles.headerCell
    : isRowIndex
      ? styles.rowIndexCell
      : styles.cell;

  const displayValue = value !== null && value !== undefined ? String(value) : '';

  return (
    <div className={cellClass}>
      {displayValue}
    </div>
  )
}

export default Cell;
