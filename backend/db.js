import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "node:path";
import os from "node:os";

let db;

export async function ensureDB() {
  if (db) return db;

  const dbPath = path.join(os.homedir(), "AppData", "Roaming", "qadence", "qadence.sqlite");

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Create table if not exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app TEXT,
      title TEXT,
      file_path TEXT,
      start_ts INTEGER,
      end_ts INTEGER,
      duration_sec INTEGER
    )
  `);

  return db;
}

export async function insertSession(session) {
  const dbConn = await ensureDB();

  await dbConn.run(
    `INSERT INTO sessions (app, title, file_path, start_ts, end_ts, duration_sec)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      session.app,
      session.title,
      session.file_path || "",
      session.start,
      session.end,
      session.duration,
    ]
  );
}

// ✅ Alias DB fields → frontend-friendly
export async function getSessionsBetween(start, end) {
  const dbConn = await ensureDB();
  const rows = await dbConn.all(
    `SELECT * FROM sessions WHERE start_ts BETWEEN ? AND ? ORDER BY start_ts ASC`,
    [start, end]
  );

  return rows.map((r) => ({
    id: r.id,
    app: r.app,
    title: r.title,
    file_path: r.file_path,
    start: r.start_ts,        // alias
    end: r.end_ts,            // alias
    duration: r.duration_sec, // alias
  }));
}

// ✅ Summaries still aggregated by app
export async function getSummaries(period = "day") {
  const dbConn = await ensureDB();

  let groupExpr;
  switch (period) {
    case "week":
      groupExpr = "strftime('%Y-%W', start_ts/1000, 'unixepoch')";
      break;
    case "month":
      groupExpr = "strftime('%Y-%m', start_ts/1000, 'unixepoch')";
      break;
    default:
      groupExpr = "date(start_ts/1000, 'unixepoch')";
  }

  const rows = await dbConn.all(
    `SELECT app, SUM(duration_sec) as total_seconds
       FROM sessions
      GROUP BY app, ${groupExpr}
      ORDER BY total_seconds DESC`
  );

  return rows.map((r) => ({
    app: r.app,
    total_seconds: r.total_seconds,
    duration: r.total_seconds, // alias for frontend
  }));
}

export function dbPath() {
  return db?.filename;
}
