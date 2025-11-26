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

  useEffect(() => {
    // Load data from mock API
    const apiData = getVeryBigMockData();
    const normalized = normalizeApiData(apiData);
    setData(normalized);
  }, []);

  const handleCellSelect = (rowIndex: number, columnKey: string) => {
    setSelectedCell({ rowIndex, columnKey })
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
        onCellSelect={handleCellSelect}
      />
    </div>
  );
};

export default Spreadsheet;
