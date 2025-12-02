import { Fragment, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'

import Cell from './Cell'
import styles from './Grid.module.css'
import type { Column, Row } from '../../utils/dataTransform'
import type { CellPosition, CellRange, CellFormat } from './Spreadsheet'

type CellMeta = {
  [rowIndex: number]: {
    [columnKey: string]: CellFormat
  }
}

interface VirtualizedGridProps {
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

const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
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
  const parentRef = useRef<HTMLDivElement>(null)

  // Row virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32, // Fixed row height
    overscan: 5 // Render 5 extra rows above/below viewport
  })

  // Column virtualizer (includes row index column)
  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: columns.length + 1, // +1 for row index column
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => index === 0 ? 60 : 150, // 60px for row index, 150px for data columns
    overscan: 3 // Render 3 extra columns left/right
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const virtualColumns = columnVirtualizer.getVirtualItems()

  const isCellSelected = (rowIndex: number, columnKey: string): boolean => {
    if (!selectedCell) return false
    return selectedCell.rowIndex === rowIndex && selectedCell.columnKey === columnKey
  }

  const isCellEditing = (rowIndex: number, columnKey: string): boolean => {
    if (!editingCell) return false
    return editingCell.rowIndex === rowIndex && editingCell.columnKey === columnKey
  }

  const isCellInRange = useMemo(() => {
    return (rowIndex: number, columnKey: string): boolean => {
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
    }
  }, [selectedRange, selectedCell, columns])

  const getCellFormat = (rowIndex: number, columnKey: string): CellFormat | undefined => {
    return cellMeta[rowIndex]?.[columnKey]
  }

  return (
    <div className={styles.virtualContainer}>
      {/* Sticky Header Row */}
      <div className={styles.stickyHeader}>
        {/* Corner cell */}
        <div
          className={styles.cornerCell}
          style={{
            width: 60,
            minHeight: 32
          }}
        />

        {/* Column headers */}
        {columns.map((column) => (
          <Cell
            key={`header-${column.key}`}
            value={column.name}
            isHeader={true}
          />
        ))}
      </div>

      {/* Virtualized scrollable area */}
      <div
        ref={parentRef}
        className={styles.virtualScrollContainer}
        style={{
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Virtual content container */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: `${columnVirtualizer.getTotalSize()}px`,
            position: 'relative'
          }}
        >
          {/* Render virtual rows */}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]

            return (
              <Fragment key={virtualRow.key}>
                {/* Render virtual columns for this row */}
                {virtualColumns.map((virtualColumn) => {
                  // First column is row index
                  if (virtualColumn.index === 0) {
                    return (
                      <div
                        key={`${virtualRow.key}-row-index`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: `${virtualColumn.size}px`,
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`
                        }}
                      >
                        <Cell
                          value={row.rowIndex}
                          isRowIndex={true}
                        />
                      </div>
                    )
                  }

                  // Data columns
                  const column = columns[virtualColumn.index - 1]
                  if (!column) return null

                  return (
                    <div
                      key={`${virtualRow.key}-${column.key}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: `${virtualColumn.size}px`,
                        height: `${virtualRow.size}px`,
                        transform: `translateX(${virtualColumn.start}px) translateY(${virtualRow.start}px)`
                      }}
                    >
                      <Cell
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
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default VirtualizedGrid
