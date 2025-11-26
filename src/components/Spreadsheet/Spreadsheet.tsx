import { useEffect, useState } from 'react';

import Grid from './Grid';
import styles from './Spreadsheet.module.css';
import { getVeryBigMockData } from '../../utils/mockApi';
import { normalizeApiData } from '../../utils/dataTransform';
import type { NormalizedData } from '../../utils/dataTransform';

export interface CellPosition {
  rowIndex: number;
  columnKey: string;
}

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<NormalizedData | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);

  useEffect(() => {
    // Load data from mock API
    const apiData = getVeryBigMockData();
    const normalized = normalizeApiData(apiData);
    setData(normalized);
  }, []);

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
    if (!data) return;

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

      return row;
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

  if (!data) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Grid
        columns={data.columns}
        rows={data.rows}
        selectedCell={selectedCell}
        editingCell={editingCell}
        onCellSelect={handleCellSelect}
        onStartEdit={handleStartEdit}
        onFinishEdit={handleFinishEdit}
        onCancelEdit={handleCancelEdit}
      />
    </div>
  );
};

export default Spreadsheet;
