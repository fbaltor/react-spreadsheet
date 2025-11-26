import Cell from './Cell';
import styles from './Grid.module.css';
import type { Column, Row } from '../../utils/dataTransform';
import type { CellPosition } from './Spreadsheet';

interface GridProps {
  columns: Column[];
  rows: Row[];
  selectedCell: CellPosition | null;
  editingCell: CellPosition | null;
  onCellSelect: (rowIndex: number, columnKey: string) => void;
  onStartEdit: (rowIndex: number, columnKey: string) => void;
  onFinishEdit: (rowIndex: number, columnKey: string, newValue: any) => void;
  onCancelEdit: () => void;
}

const Grid: React.FC<GridProps> = ({
  columns,
  rows,
  selectedCell,
  onCellSelect,
  editingCell,
  onStartEdit,
  onFinishEdit,
  onCancelEdit
}) => {
  // Calculate grid template columns: 60px for row index + 150px for each data column
  const gridTemplateColumns = `60px repeat(${columns.length}, 150px)`;

  const isCellSelected = (rowIndex: number, columnKey: string): boolean => {
    if (!selectedCell) return false;
    return selectedCell.rowIndex === rowIndex && selectedCell.columnKey === columnKey;
  }

  const isCellEditing = (rowIndex: number, columnKey: string): boolean => {
    if (!editingCell) return false;

    return editingCell.rowIndex === rowIndex && editingCell.columnKey === columnKey
  }

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns }}
    >
      {/* Top-left corner cell (empty) */}
      <div className={styles.cornerCell}></div>

      {/* Column headers */}
      {columns.map((column) => (
        <Cell
          key={`header-${column.key}`}
          value={column.name}
          isHeader={true}
        />
      ))}

      {/* Data rows */}
      {rows.map((row) => (
        <>
          {/* Row index cell */}
          <Cell
            key={`row-index-${row.rowIndex}`}
            value={row.rowIndex}
            isRowIndex={true}
          />

          {/* Data cells */}
          {columns.map((column) => (
            <Cell
              key={`cell-${row.rowIndex}-${column.key}`}
              value={row.cells[column.key]}
              isSelected={isCellSelected(row.rowIndex, column.key)}
              isEditing={isCellEditing(row.rowIndex, column.key)}
              onSelect={() => onCellSelect(row.rowIndex, column.key)}
              onStartEdit={() => onStartEdit(row.rowIndex, column.key)}
              onFinishEdit={(newValue) => onFinishEdit(row.rowIndex, column.key, newValue)}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Grid;
