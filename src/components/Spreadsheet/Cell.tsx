import { useState, useEffect, useRef } from 'react'

import styles from './Cell.module.css'

import type { CellFormat } from './Spreadsheet'


interface CellProps {
  value: any
  isHeader?: boolean
  isRowIndex?: boolean
  isSelected?: boolean
  isEditing?: boolean
  format?: CellFormat
  onSelect?: () => void
  onStartEdit?: () => void
  onFinishEdit?: (newValue: any) => void
  onCancelEdit?: () => void
}

const Cell: React.FC<CellProps> = ({
  value,
  isHeader = false,
  isRowIndex = false,
  isSelected = false,
  isEditing = false,
  format,
  onSelect,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
}) => {
  const [editValue, setEditValue] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setEditValue(value !== null && value !== undefined ? String(value) : '')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isEditing, value])

  const getFormatClasses = (): string => {
    if (!format) return ''

    const classes: string[] = []
    if (format.bold) classes.push(styles.bold)
    if (format.italic) classes.push(styles.italic)
    if (format.align === 'left') classes.push(styles.alignLeft)
    if (format.align === 'center') classes.push(styles.alignCenter)
    if (format.align === 'right') classes.push(styles.alignRight)

    return classes.join(' ')
  }

  const getClassName = (): string => {
    if (isHeader) return styles.headerCell
    if (isRowIndex) return styles.rowIndexCell

    const formatClasses = getFormatClasses()

    if (isEditing) return `${styles.cell} ${styles.editing} ${formatClasses}`
    if (isSelected) return `${styles.cell} ${styles.selected} ${formatClasses}`

    return `${styles.cell} ${formatClasses}`
  }

  const getInputClasses = (): string => {
    const classes = [styles.cellInput]
    if (format?.bold) classes.push(styles.bold)
    if (format?.italic) classes.push(styles.italic)
    if (format?.align === 'left') classes.push(styles.alignLeft)
    if (format?.align === 'center') classes.push(styles.alignCenter)
    if (format?.align === 'right') classes.push(styles.alignRight)
    return classes.join(' ')
  }

  const displayValue = value !== null && value !== undefined ? String(value) : ''

  const handleClick = () => {
    if (!isHeader && !isRowIndex && onSelect) {
      onSelect()
    }
  }

  const handleDoubleClick = () => {
    if (!isHeader && !isRowIndex && onStartEdit) {
      onStartEdit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onFinishEdit?.(editValue)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancelEdit?.()
    }
  }

  const handleBlur = () => {
    onFinishEdit?.(editValue)
  }

  if (isEditing) {
    return (
      <div className={getClassName()}>
        <input
          ref={inputRef}
          type="text"
          className={getInputClasses()}
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      </div>
    )
  }

  return (
    <div
      className={getClassName()}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {displayValue}
    </div>
  )
}

export default Cell
