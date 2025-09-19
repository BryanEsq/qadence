import sqlite3 from 'sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let db = null
let dbFile = null

export async function ensureDB(basePath) {
  dbFile = path.join(basePath, 'qadence.sqlite')
  const exists = fs.existsSync(dbFile)
  db = new sqlite3.Database(dbFile)
  if (!exists) {
    console.log('🆕 Creating new DB at', dbFile)
    await initSchema()
  } else {
    console.log('📂 Using existing database at', dbFile)
  }

  // 🔑 Always check schema after opening DB
  await migrateSchema()
}

function initSchema() {
  return new Promise((resolve, reject) => {
    db.exec(
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app TEXT,
        title TEXT,
        file_path TEXT,
        start_ts INTEGER,
        end_ts INTEGER,
        duration_sec INTEGER
      );`,
      err => {
        if (err) reject(err)
        else resolve()
      }
    )
  })
}

async function migrateSchema() {
  const expectedColumns = [
    { name: 'id', type: 'INTEGER' },
    { name: 'app', type: 'TEXT' },
    { name: 'title', type: 'TEXT' },
    { name: 'file_path', type: 'TEXT' },
    { name: 'start_ts', type: 'INTEGER' },
    { name: 'end_ts', type: 'INTEGER' },
    { name: 'duration_sec', type: 'INTEGER' },
  ]

  const existing = await getTableInfo('sessions')
  const existingNames = existing.map(col => col.name)

  console.log('🔍 Existing session table columns:', existingNames)

  for (const col of expectedColumns) {
    if (!existingNames.includes(col.name)) {
      await runSQL(`ALTER TABLE sessions ADD COLUMN ${col.name} ${col.type}`)
      console.log(`🔧 Migrated DB: added missing column '${col.name}' (${col.type})`)
    }
  }
}

function getTableInfo(table) {
  return new Promise((resolve, reject) => {
    db.all(`PRAGMA table_info(${table});`, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function runSQL(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function insertSession(session) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO sessions
      (app, title, file_path, start_ts, end_ts, duration_sec)
      VALUES (?, ?, ?, ?, ?, ?)`
    const params = [
      session.app,
      session.title,
      session.filePath || '',
      session.start_ts,
      session.end_ts,
      session.duration_sec
    ]
    db.run(sql, params, function (err) {
      if (err) {
        console.error('❌ insertSession error:', err)
        reject(err)
      } else {
        console.log(
          `✅ insertSession OK: id=${this.lastID} app=${session.app} dur=${session.duration_sec}s`
        )
        resolve(this.lastID)
      }
    })
  })
}

export function getSessionsBetween(startISO, endISO) {
  return new Promise((resolve, reject) => {
    const start = new Date(startISO).getTime()
    const end = new Date(endISO).getTime()
    db.all(
      `SELECT * FROM sessions WHERE start_ts >= ? AND end_ts <= ? ORDER BY start_ts ASC`,
      [start, end],
      (err, rows) => {
        if (err) {
          console.error('❌ getSessionsBetween error:', err)
          reject(err)
        } else {
          console.log(`📊 getSessionsBetween ${rows.length} rows`)
          resolve(rows)
        }
      }
    )
  })
}

export function getSummaries(period = 'day') {
  return new Promise((resolve, reject) => {
    let sql = `SELECT app, SUM(duration_sec) as total_sec
               FROM sessions
               GROUP BY app
               ORDER BY total_sec DESC`
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('❌ getSummaries error:', err)
        reject(err)
      } else {
        console.log(`📈 getSummaries ${rows.length} rows`)
        resolve({ period, rows })
      }
    })
  })
}

export function exportData(format, options) {
  // TODO: implement later
  console.log('⬇️ exportData not yet implemented')
  return {}
}

export function dbPath() {
  return dbFile
}
