import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function ActivityLog() {
  const [sessions, setSessions] = useState([])

  async function load() {
    const start = dayjs().startOf('day').toISOString()
    const end = dayjs().endOf('day').toISOString()
    const rows = await window.qadence.sessionsBetween(start, end)
    setSessions(rows)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 10000) // refresh every 10s
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>Activity Log (Today)</h2>
      {sessions.length === 0 ? (
        <p>No sessions recorded yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>App</th>
              <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>Title</th>
              <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>Start</th>
              <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>End</th>
              <th style={{ borderBottom: '1px solid #444', textAlign: 'right' }}>Duration (s)</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={i}>
                <td>{s.app}</td>
                <td>{s.title}</td>
                <td>{dayjs(s.start_ts).format('HH:mm:ss')}</td>
                <td>{dayjs(s.end_ts).format('HH:mm:ss')}</td>
                <td style={{ textAlign: 'right' }}>{s.duration_sec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
