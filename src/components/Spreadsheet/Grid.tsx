import { Fragment, useCallback} from 'react'

import Cell from './Cell'
import styles from './Grid.module.css'
import type { Column, Row } from '../../utils/dataTransform'
import type { CellPosition, CellRange, CellFormat } from './Spreadsheet'

type CellMeta = {
  [rowIndex: number]: {
    [columnKey: string]: CellFormat
  }
};


interface GridProps {
  columns: Column[]
  rows: Row[]
  selectedCell: CellPosition | null
  selectedRange: CellRange | null
  editingCell: CellPosition | null
  cellMeta: CellMeta
  onCellSelect: (rowIndex: number, columnKey: string) => void
  onCellMouseDown: (rowIndex: number, columnKey: string) => void
  onCellMouseEnter: (rowIndex: number, columnKey: string) => void
  onStartEdit: (rowIndex: number, columnKey: string) => void
  onFinishEdit: (rowIndex: number, columnKey: string, newValue: any) => void
  onCancelEdit: () => void
}

const Grid: React.FC<GridProps> = ({
  columns,
  rows,
  selectedCell,
  selectedRange,
  editingCell,
  cellMeta,
  onCellSelect,
  onCellMouseDown,
  onCellMouseEnter,
  onStartEdit,
  onFinishEdit,
  onCancelEdit
}) => {
  // Calculate grid template columns: 60px for row index + 150px for each data column
  const gridTemplateColumns = `60px repeat(${columns.length}, 150px)`

  const isCellSelected = (rowIndex: number, columnKey: string): boolean => {
    if (!selectedCell) return false
    return selectedCell.rowIndex === rowIndex && selectedCell.columnKey === columnKey
  }


  const isCellEditing = (rowIndex: number, columnKey: string): boolean => {
    if (!editingCell) return false
    return editingCell.rowIndex === rowIndex && editingCell.columnKey === columnKey
  }

  const isCellInRange = useCallback((rowIndex: number, columnKey: string): boolean => {
    if (!selectedRange) return false

    // Don't mark the primary selected cell as "in range"
    if (selectedCell && 
        selectedCell.rowIndex === rowIndex && 
        selectedCell.columnKey === columnKey) {
      return false
    }

    const { start, end } = selectedRange

    // Get column indices
    const columnKeys = columns.map(c => c.key)
    const colIndex = columnKeys.indexOf(columnKey)
    const startColIndex = columnKeys.indexOf(start.columnKey)
    const endColIndex = columnKeys.indexOf(end.columnKey)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    // Get row indices
    const minRowIndex = Math.min(start.rowIndex, end.rowIndex)
    const maxRowIndex = Math.max(start.rowIndex, end.rowIndex)

    return (
      rowIndex >= minRowIndex &&
      rowIndex <= maxRowIndex &&
      colIndex >= minColIndex &&
      colIndex <= maxColIndex
    )
  }, [selectedRange, selectedCell, columns])

  const getCellFormat = (rowIndex: number, columnKey: string): CellFormat | undefined => {
    return cellMeta[rowIndex]?.[columnKey]
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
        <Fragment key={row.rowIndex}>
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
              isInRange={isCellInRange(row.rowIndex, column.key)}
              isEditing={isCellEditing(row.rowIndex, column.key)}
              format={getCellFormat(row.rowIndex, column.key)}
              onSelect={() => onCellSelect(row.rowIndex, column.key)}
              onMouseDown={() => onCellMouseDown(row.rowIndex, column.key)}
              onMouseEnter={() => onCellMouseEnter(row.rowIndex, column.key)}
              onStartEdit={() => onStartEdit(row.rowIndex, column.key)}
              onFinishEdit={(newValue) => onFinishEdit(row.rowIndex, column.key, newValue)}
              onCancelEdit={onCancelEdit}
            />
          ))}
        </Fragment>
      ))}
    </div>
  )
}

export default Grid
