import styles from './Toolbar.module.css'
import type { CellFormat } from './Spreadsheet'

interface ToolbarProps {
  currentFormat: CellFormat | null
  disabled: boolean
  onToggleBold: () => void
  onToggleItalic: () => void
  onSetAlign: (align: 'left' | 'center' | 'right') => void
}

const Toolbar: React.FC<ToolbarProps> = ({
  currentFormat,
  disabled,
  onToggleBold,
  onToggleItalic,
  onSetAlign
}) => {
  return (
    <div className={styles.toolbar}>
      {/* Text formatting */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${currentFormat?.bold ? styles.active : ''}`}
          onClick={onToggleBold}
          disabled={disabled}
          title="Bold"
        >
          B
        </button>
        <button
          className={`${styles.button} ${currentFormat?.italic ? styles.active : ''}`}
          onClick={onToggleItalic}
          disabled={disabled}
          title="Italic"
          style={{ fontStyle: 'italic' }}
        >
          I
        </button>
      </div>

      <div className={styles.divider} />

      {/* Alignment */}
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${currentFormat?.align === 'left' ? styles.active : ''}`}
          onClick={() => onSetAlign('left')}
          disabled={disabled}
          title="Align Left"
        >
          ⬅
        </button>
        <button
          className={`${styles.button} ${currentFormat?.align === 'center' ? styles.active : ''}`}
          onClick={() => onSetAlign('center')}
          disabled={disabled}
          title="Align Center"
        >
          ⬌
        </button>
        <button
          className={`${styles.button} ${currentFormat?.align === 'right' ? styles.active : ''}`}
          onClick={() => onSetAlign('right')}
          disabled={disabled}
          title="Align Right"
        >
          ➡
        </button>
      </div>
    </div>
  )
}

export default Toolbar
