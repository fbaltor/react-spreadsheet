import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import express from 'express'
import cors from 'cors'


const app = express()
const PORT = 8000

const dataDir = path.join(process.cwd(), 'api', 'data')

interface FileInfo {
  filename: string
  size: string 
  modified: string
  rowCount: number
}

function getDataFilenames(): string[] {
  return fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))
}

function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

function getAvailableFiles(): FileInfo[] {
  return getDataFilenames().map(filename => {
    const filePath = path.join(dataDir, filename)
    const stats = fs.statSync(filePath)

    let rowCount = 0
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      rowCount = content?.Values?.items?.length ?? 0
    } catch {
      // If parsing fails, leave rowCount as 0
    }

    return {
      filename,
      size: formatBytes(stats.size),
      modified: stats.mtime.toISOString(),
      rowCount
    }
  })
}

app.use(express.json())
app.use(cors())

app.get('/api/files', (_req, res) => {
  try {
    const files = getAvailableFiles()
    res.json(files)
  } catch (error) {
    console.error('Failed to list files:', error)
    res.status(500).json({ error: 'Failed to list files' })
  }
})

app.get('/api/:filename', (req, res) => {
  const filename = path.basename(req.params.filename)

  if (!/^[a-zA-Z0-9_\-]+\.json$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename format' })
  }

  if (!getDataFilenames().includes(filename)) {
    return res.status(404).json({ error: 'File not found' })
  }

  try {
    const filePath = path.join(dataDir, filename)
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    res.json(data)
  } catch (error) {
    console.error('Failed to read file:', error)
    res.status(500).json({ error: 'Failed to read file' })
  }
})

// Serve static files (built React app)
const distPath = path.join(process.cwd(), 'dist')
app.use(express.static(distPath))

// SPA fallback - serve index.html for all other routes
app.get('*path', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
