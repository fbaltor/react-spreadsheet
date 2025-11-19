// Types for our internal data structure
export interface Column {
  name: string;
  key: string;
}

export interface Row {
  rowIndex: number;
  cells: { [columnKey: string]: any };
}

export interface NormalizedData {
  columns: Column[];
  rows: Row[];
}

// API response types
interface ApiColumn {
  name: string;
  key: string;
}

interface ApiItem {
  [key: string]: any;
}

export interface ApiResponse {
  Values: {
    columns: ApiColumn[];
    items: ApiItem[];
  };
}

/**
 * Converts API response format to our internal data structure
 * 
 * Input: API format with columns and items
 * Output: Normalized format with columns and rows (each row has rowIndex and cells)
 */
export const normalizeApiData = (apiResponse: ApiResponse): NormalizedData => {
  const { columns, items } = apiResponse.Values;

  // Transform items array into rows array with rowIndex
  const rows: Row[] = items.map((item, index) => ({
    rowIndex: index,
    cells: item
  }));

  return {
    columns,
    rows
  };
};
