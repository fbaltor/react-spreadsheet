import './index.css'
import Spreadsheet from './components/Spreadsheet/Spreadsheet'

function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
      <h1 style={{ margin: 0, marginBottom: '20px' }}>Spreadsheet Component</h1>
      <div style={{ flex: 1, border: '1px solid #ccc', minHeight: 0 }}>
        <Spreadsheet />
      </div>
    </div>
  )
}

export default App
