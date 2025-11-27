import { useEffect, useState } from 'react'

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
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null)
  const [cellMeta, setCellMeta] = useState<CellMeta>({})

  useEffect(() => {
    // Load data from mock API
    const apiData = getVeryBigMockData()
    const normalized = normalizeApiData(apiData)
    setData(normalized)
  }, [])
  
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

    const { rowIndex, columnKey } = selectedCell
    const currentFormat = getCellFormat(rowIndex, columnKey) || {}

    setCellMeta(prev => ({
      ...prev,
      [rowIndex]: {
        ...prev[rowIndex],
        [columnKey]: {
          ...currentFormat,
          ...updates
        }
      }
    }))
  }

  const handleCellSelect = (rowIndex: number, columnKey: string) => {
    if (editingCell) {
      setEditingCell(null)
    }
    setSelectedCell({ rowIndex, columnKey })
  }

  const handleStartEdit = (rowIndex: number, columnKey: string) => {
    setSelectedCell({ rowIndex, columnKey })
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
      <Grid
        columns={data.columns}
        rows={data.rows}
        selectedCell={selectedCell}
        editingCell={editingCell}
        cellMeta={cellMeta}
        onCellSelect={handleCellSelect}
        onStartEdit={handleStartEdit}
        onFinishEdit={handleFinishEdit}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  )
}

export default Spreadsheet
