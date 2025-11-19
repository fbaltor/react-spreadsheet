import { useEffect, useState } from 'react';

import Grid from './Grid';
import styles from './Spreadsheet.module.css';
import { getMockData, getBigMockData, getVeryBigMockData } from '../../utils/mockApi';
import { normalizeApiData } from '../../utils/dataTransform';
import type { NormalizedData } from '../../utils/dataTransform';

const Spreadsheet: React.FC = () => {
  const [data, setData] = useState<NormalizedData | null>(null);

  useEffect(() => {
    // Load data from mock API
    const apiData = getVeryBigMockData();
    const normalized = normalizeApiData(apiData);
    setData(normalized);
  }, []);

  if (!data) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Grid columns={data.columns} rows={data.rows} />
    </div>
  );
};

export default Spreadsheet;
