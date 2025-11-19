import Cell from './Cell';
import styles from './Grid.module.css';
import type { Column, Row } from '../../utils/dataTransform';

interface GridProps {
  columns: Column[];
  rows: Row[];
}

const Grid: React.FC<GridProps> = ({ columns, rows }) => {
  // Calculate grid template columns: 60px for row index + 150px for each data column
  const gridTemplateColumns = `60px repeat(${columns.length}, 150px)`;

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
            />
          ))}
        </>
      ))}
    </div>
  );
};

export default Grid;
