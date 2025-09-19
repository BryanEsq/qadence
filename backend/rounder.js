import sqlite3 from 'sqlite3'
import dayjs from 'dayjs'

let _dbPath

export function setDbPath(path) {
  _dbPath = path
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

/**
 * Round sessions into 6-minute increments.
 * @param {string} isoDate - base date (start of period)
 * @param {string} period - "day" | "week" | "month"
 */
export async function roundToSixMinutes(isoDate, period = 'day') {
  if (!_dbPath) throw new Error("Database path not set. Call setDbPath() first.")
  const sqlite = new sqlite3.Database(_dbPath)

  let start, end
  if (period === 'week') {
    start = dayjs(isoDate).startOf('week').valueOf()
    end = dayjs(isoDate).endOf('week').valueOf()
  } else if (period === 'month') {
    start = dayjs(isoDate).startOf('month').valueOf()
    end = dayjs(isoDate).endOf('month').valueOf()
  } else {
    start = dayjs(isoDate).startOf('day').valueOf()
    end = dayjs(isoDate).endOf('day').valueOf()
  }

  const rows = await all(
    sqlite,
    `SELECT app, title, SUM(duration_sec) as dur
     FROM sessions
     WHERE start_ts BETWEEN ? AND ?
     GROUP BY app, title`,
    [start, end]
  )

  sqlite.close()

  const rounded = rows.map(r => {
    const six = 6 * 60
    const blocks = Math.ceil(r.dur / six)
    return {
      app: r.app,
      title: r.title,
      seconds: r.dur,
      rounded_seconds: blocks * six,
      rounded_minutes: blocks * 6,
    }
  })

  const report = {
    base: isoDate,
    period,
    entries: rounded,
    total_minutes: rounded.reduce((a, b) => a + b.rounded_minutes, 0),
  }

  console.log('📦 roundToSixMinutes returning:', report)
  return report
}
