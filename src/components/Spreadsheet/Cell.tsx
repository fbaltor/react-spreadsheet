import { useState, useEffect, useRef } from 'react'

import styles from './Cell.module.css'


interface CellProps {
  value: any;
  isHeader?: boolean;
  isRowIndex?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  onSelect?: () => void;
  onStartEdit?: () => void;
  onFinishEdit?: (newValue: any) => void;
  onCancelEdit?: () => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  isHeader = false,
  isRowIndex = false,
  isSelected = false,
  isEditing = false,
  onSelect,
  onStartEdit,
  onFinishEdit,
  onCancelEdit,
}) => {
  const [editValue, setEditValue] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      setEditValue(value !== null && value !== undefined ? String(value) : '')
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isEditing, value])

  const getClassName = (): string => {
    if (isHeader) return styles.headerCell;
    if (isRowIndex) return styles.rowIndexCell;

    if (isEditing) return `${styles.cell} ${styles.editing}`
    if (isSelected) return `${styles.cell} ${styles.selected}`

    return styles.cell;
  }

  const displayValue = value !== null && value !== undefined ? String(value) : '';

  const handleClick = () => {
    if (!isHeader && !isRowIndex && onSelect) {
      onSelect()
    }
  }

  const handleDoubleClick = () => {
    if (!isHeader && !isRowIndex && onStartEdit) {
      onStartEdit();
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onFinishEdit?.(editValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancelEdit?.();
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
          className={styles.cellInput}
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

export default Cell;
