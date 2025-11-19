import './index.css'
import Spreadsheet from './components/Spreadsheet/Spreadsheet'

function App() {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h1>Spreadsheet Component</h1>
      <div style={{ flex: 1, border: '1px solid #ccc', marginTop: '20px' }}>
        <Spreadsheet />
      </div>
    </div>
  )
}

export default App
