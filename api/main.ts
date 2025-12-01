import path from "node:path"
import process from 'node:process'

import express from 'express'
import cors from 'cors'

import data from './data/data.json' with { type: 'json' }


const app = express()
const PORT = 8000

app.use(express.json())
app.use(cors())

// API routes
app.get('/api/data', (_req, res) => {
  const responseData = data
  res.json(responseData)
})

// Serve static files (built React app)
const distPath = path.join(process.cwd(), "dist")
app.use(express.static(distPath))

// SPA fallback - serve index.html for all other routes
app.get("*path", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
