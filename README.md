# React Spreadsheet Component

A performant spreadsheet component built with React, TypeScript, and Vite.

## Setup

```bash
npm install
```

## Running

Development mode (runs both frontend and API server):

```bash
# Terminal 1 - API server
npm run serve

# Terminal 2 - Frontend
npm run dev
```

Frontend runs on `http://localhost:3000`, API on `http://localhost:8000`.

Production build:

```bash
npm run build
npm run serve
```

## Implementation Approach

### Architecture

- **Frontend**: React 19 with TypeScript, Vite for bundling
- **Backend**: Express server serving JSON data files from `api/data/`
- **Styling**: CSS Modules for component-scoped styles

### Core Features

- Cell selection (click) and range selection (click-drag)
- Inline cell editing (double-click to edit, Enter to confirm, Escape to cancel)
- Text formatting: bold, italic, alignment
- File picker to load different datasets

### Performance

The component switches between two rendering modes based on dataset size:

- **Standard Grid** (`<100 rows`): CSS Grid layout, straightforward DOM rendering
- **Virtualized Grid** (`>=100 rows`): Uses `@tanstack/react-virtual` to render only visible rows/columns

Virtualization keeps the DOM lightweight regardless of dataset size.

### Data Flow

1. API returns data in `{ Values: { columns, items } }` format
2. `normalizeApiData` transforms it to `{ columns, rows }` with explicit row indices
3. Grid components receive normalized data and render cells

## Design Decisions

- **Threshold of 100 rows for virtualization**: Balances simplicity for small datasets with performance for larger ones
- **CSS Modules over styled-components**: No runtime overhead, simpler debugging
- **Separate Grid and VirtualizedGrid components**: Keeps each implementation focused; easier to maintain and test
- **Cell metadata stored separately from cell values**: Formatting (bold, italic, align) lives in `cellMeta` state, keeping data and presentation concerns separate
- **Row index column**: Included as a fixed reference, styled distinctly from data columns

## Assumptions

- Data is read-only from the server (edits are local-only, not persisted)
- All columns have the same width (150px for data, 60px for row index)
- Cell values are strings or numbers; no complex types
- JSON files in `api/data/` follow the expected schema

## Improvements With More Time

- **Keyboard navigation**: Arrow keys to move selection, Tab to move between cells
- **Column resizing**: Drag column borders to adjust width
- **Sorting and filtering**: Click column headers to sort, add filter controls
- **Undo/redo**: Track edit history
- **Persist changes**: POST edits back to the server
- **Copy/paste**: Support clipboard operations for cell ranges
- **Column virtualization in header**: Currently header renders all columns; should virtualize for very wide datasets
- **Tests**: Expand unit tests beyond `dataTransform`; add integration tests for Grid interactions
- **Accessibility**: ARIA attributes, screen reader support, focus management

## Live Demo

[Link to deployed application]
