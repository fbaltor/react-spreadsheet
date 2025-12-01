import styles from './Filepicker.module.css'


export interface FileInfo {
  filename: string
  size: string
  modified: string
  rowCount: number
}

interface FilePickerProps {
  files: FileInfo[]
  selectedFile: string | null
  onSelectFile: (filename: string) => void
  loading?: boolean
}

const FilePicker: React.FC<FilePickerProps> = ({
  files,
  selectedFile,
  onSelectFile,
  loading = false
}) => {
  const selectedFileInfo = files.find(f => f.filename === selectedFile)

  return (
    <div className={styles.container}>
      <label className={styles.label}>File:</label>
      <select
        className={styles.select}
        value={selectedFile ?? ''}
        onChange={(e) => onSelectFile(e.target.value)}
        disabled={loading || files.length === 0}
      >
        {files.length === 0 ? (
          <option value="">{loading ? 'Loading...' : 'No files available'}</option>
        ) : (
          <>
            <option value="" disabled>Select a file...</option>
            {files.map(file => (
              <option key={file.filename} value={file.filename}>
                {file.filename} ({file.rowCount} rows, {file.size})
              </option>
            ))}
          </>
        )}
      </select>

      {selectedFileInfo && (
        <div className={styles.metadata}>
          <span className={styles.metaItem}>{selectedFileInfo.rowCount} rows</span>
          <span className={styles.metaSeparator}>-</span>
          <span className={styles.metaItem}>{selectedFileInfo.size}</span>
        </div>
      )}
    </div>
  )
}

export default FilePicker
