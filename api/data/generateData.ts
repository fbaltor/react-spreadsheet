import fs from "node:fs"

// Types matching your existing schema
interface ApiColumn {
  name: string
  key: string
}

interface ApiItem {
  [key: string]: any
}

export interface ApiResponse {
  Values: {
    columns: ApiColumn[]
    items: ApiItem[]
  }
}

/**
 * Generates random data conforming to the ApiResponse schema.
 *
 * @param numColumns - Total number of columns (including the label column)
 * @param numRows - Number of data rows to generate
 * @returns ApiResponse with random data
 */
export function generateRandomData(numColumns: number, numRows: number): ApiResponse {
  if (numColumns < 1) {
    throw new Error("numColumns must be at least 1")
  }

  // Generate columns
  const columns: ApiColumn[] = []

  // First column is always the label column
  columns.push({ name: "Label", key: "label" })

  // Remaining columns are numeric
  for (let i = 1; i < numColumns; i++) {
    columns.push({ name: `Col ${i}`, key: `col${i}` })
  }

  // Generate items (rows)
  const items: ApiItem[] = []

  for (let rowIdx = 0; rowIdx < numRows; rowIdx++) {
    const item: ApiItem = {
      label: `Row ${rowIdx}`
    }

    // Add random numeric values for each non-label column
    for (let colIdx = 1; colIdx < numColumns; colIdx++) {
      item[`col${colIdx}`] = Math.random() * 1e8
    }

    items.push(item)
  }

  return {
    Values: {
      columns,
      items
    }
  }
}

const NUM_COLUMNS = 10
const NUM_ROWS = 1000
const OUTPUT_FILE = "data_big.json"

const data = generateRandomData(NUM_COLUMNS, NUM_ROWS)
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2))

console.log(`Generated ${NUM_ROWS} rows × ${NUM_COLUMNS} columns → ${OUTPUT_FILE}`)
