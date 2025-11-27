import { useEffect, useState, useCallback } from 'react'

import Grid from './Grid'
import Toolbar from './Toolbar'
import styles from './Spreadsheet.module.css'
import { getVeryBigMockData } from '../../utils/mockApi'
import { normalizeApiData } from '../../utils/dataTransform'
import type { NormalizedData } from '../../utils/dataTransform'

export interface CellPosition {
  rowIndex: number
  columnKey: string
}

export interface CellRange {
  start: CellPosition
  end: CellPosition
}

export interface CellFormat {
  bold?: boolean
  italic?: boolean
  align?: 'left' | 'center' | 'right'
}

type CellMeta = {
  [rowIndex: number]: {
    [colunmKey: string]: CellFormat
  }
}

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<NormalizedData | null>(null)
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null)
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [cellMeta, setCellMeta] = useState<CellMeta>({})

  useEffect(() => {
    // Load data from mock API
    const apiData = getVeryBigMockData()
    const normalized = normalizeApiData(apiData)
    setData(normalized)
  }, [])

  useEffect(() => {
    const handleMouseUp = () => {
      if (isSelecting) {
        setIsSelecting(false)
      }
    }

    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [isSelecting])

  const getCellsInRange = useCallback((range: CellRange | null): CellPosition[] => {
    if (!range || !data) return []

    const { start, end } = range
    const cells: CellPosition[] = []

    // Get column indices
    const columnKeys = data.columns.map(c => c.key)
    const startColIndex = columnKeys.indexOf(start.columnKey)
    const endColIndex = columnKeys.indexOf(end.columnKey)
    const minColIndex = Math.min(startColIndex, endColIndex)
    const maxColIndex = Math.max(startColIndex, endColIndex)

    // Get row indices
    const minRowIndex = Math.min(start.rowIndex, end.rowIndex)
    const maxRowIndex = Math.max(start.rowIndex, end.rowIndex)

    for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
      for (let colIndex = minColIndex; colIndex <= maxColIndex; colIndex++) {
        cells.push({
          rowIndex,
          columnKey: columnKeys[colIndex]
        })
      }
    }

    return cells
  }, [data])
  
  const getCellFormat = (rowIndex: number, columnKey: string): CellFormat | undefined => {
    return cellMeta[rowIndex]?.[columnKey]
  }

  // Get format for currently selected cell
  const getSelectedCellFormat = (): CellFormat | null => {
    if (!selectedCell) return null
    return getCellFormat(selectedCell.rowIndex, selectedCell.columnKey) || null
  }

  const updateSelectedCellFormat = (updates: Partial<CellFormat>) => {
    if (!selectedCell) return

    const cellsToUpdate = selectedRange 
      ? getCellsInRange(selectedRange)
      : [selectedCell]

    setCellMeta(prev => {
      const newMeta = { ...prev }
      
      for (const cell of cellsToUpdate) {
        const { rowIndex, columnKey } = cell
        const currentFormat = getCellFormat(rowIndex, columnKey) || {}
        
        if (!newMeta[rowIndex]) {
          newMeta[rowIndex] = {}
        }
        
        newMeta[rowIndex] = {
          ...newMeta[rowIndex],
          [columnKey]: {
            ...currentFormat,
            ...updates
          }
        }
      }
      
      return newMeta
    })
  }

  const handleCellMouseDown = (rowIndex: number, columnKey: string) => {
    if (editingCell) {
      setEditingCell(null)
    }
    
    setSelectedCell({ rowIndex, columnKey })
    setSelectedRange({
      start: { rowIndex, columnKey },
      end: { rowIndex, columnKey }
    })
    setIsSelecting(true)
  }

  // Extend selection on mouse enter while dragging
  const handleCellMouseEnter = (rowIndex: number, columnKey: string) => {
    if (isSelecting && selectedRange) {
      setSelectedRange(prev => prev ? {
        ...prev,
        end: { rowIndex, columnKey }
      } : null)
    }
  }

  const handleCellSelect = (rowIndex: number, columnKey: string) => {
    if (editingCell) {
      setEditingCell(null)
    }
    setSelectedCell({ rowIndex, columnKey })
    // Clear range on single click
    setSelectedRange(null)
  }


  const handleStartEdit = (rowIndex: number, columnKey: string) => {
    setSelectedCell({ rowIndex, columnKey })
    setSelectedRange(null) // Clear range when editing
    setEditingCell({ rowIndex, columnKey })
  }

  const handleFinishEdit = (rowIndex: number, columnKey: string, newValue: any) => {
    if (!data) return

    const newRows = data.rows.map(row => {
      if (row.rowIndex === rowIndex) {
        return {
          ...row,
          cells: {
            ...row.cells,
            [columnKey]: newValue
          }
        }
      }

      return row
    })

    setData({
      ...data,
      rows: newRows
    })

    setEditingCell(null)
  }


  const handleCancelEdit = () => {
    setEditingCell(null)
  }

  // Formatting handlers
  const handleToggleBold = () => {
    const currentFormat = getSelectedCellFormat()
    updateSelectedCellFormat({ bold: !currentFormat?.bold })
  }

  const handleToggleItalic = () => {
    const currentFormat = getSelectedCellFormat()
    updateSelectedCellFormat({ italic: !currentFormat?.italic })
  }

  const handleSetAlign = (align: 'left' | 'center' | 'right') => {
    updateSelectedCellFormat({ align })
  }

  if (!data) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <Toolbar 
        currentFormat={getSelectedCellFormat()}
        disabled={!selectedCell}
        onToggleBold={handleToggleBold}
        onToggleItalic={handleToggleItalic}
        onSetAlign={handleSetAlign}
      />
      <div className={styles.gridContainer}>
      <Grid
          columns={data.columns}
          rows={data.rows}
          selectedCell={selectedCell}
          selectedRange={selectedRange}
          editingCell={editingCell}
          cellMeta={cellMeta}
          onCellSelect={handleCellSelect}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onStartEdit={handleStartEdit}
          onFinishEdit={handleFinishEdit}
          onCancelEdit={handleCancelEdit}
      />
      </div>
    </div>
  )
}

export default Spreadsheet
