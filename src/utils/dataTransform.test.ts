import { test, expect } from 'vitest'

import { normalizeApiData, } from "./dataTransform";
import type { ApiResponse } from "./dataTransform"


const mockApiCall = async (): Promise<ApiResponse> => ({
  Values: {
    columns: [
      { name: 'Product', key: 'product' },
      { name: 'Revenue', key: 'revenue' }
    ],
    items: [
      { product: 'A', revenue: 100 },
      { product: 'B', revenue: 200 }
    ]
  }
});

test('normalizeApiData transforms API response into normalized structure', async () => {
  const apiResponse = await mockApiCall()

  const result = normalizeApiData(apiResponse)
  // console.log(JSON.stringify(result, null, 2))

  expect(result.columns).toEqual([
    { name: 'Product', key: 'product' },
    { name: 'Revenue', key: 'revenue' },
  ])

  expect(result.rows).toEqual([{
    rowIndex: 0,
    cells: { product: 'A', revenue: 100 },
  },
  {
    rowIndex: 1,
    cells: { product: 'B', revenue: 200 }
  }
  ])
})
