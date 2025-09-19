import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureDB, dbPath, getSummaries, getSessionsBetween } from '../backend/db.js'
import { startTracker, stopTracker } from '../backend/tracker.js'
import { setDbPath, roundToSixMinutes } from '../backend/rounder.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })
  win.loadURL('http://localhost:5173')
}

app.whenReady().then(async () => {
  await ensureDB(app.getPath('userData'))
  setDbPath(dbPath())
  startTracker()
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  stopTracker()
})

// IPC handlers
ipcMain.handle('db:path', () => dbPath())
ipcMain.handle('db:sessionsBetween', (_e, args) => getSessionsBetween(args.start, args.end))
ipcMain.handle('db:summaries', (_e, args) => getSummaries(args.period))
ipcMain.handle('db:round', (_e, args) => roundToSixMinutes(args.isoDate, args.period || 'day'))
ipcMain.handle('db:export', (_e, args) => exportData(args.format, args.options || {}))
