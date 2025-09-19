import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function RoundedReport() {
  const [report, setReport] = useState(null)
  const [range, setRange] = useState('day')
  const [customDate, setCustomDate] = useState(dayjs().format('YYYY-MM-DD'))

  async function load(period = 'day', dateOverride = null) {
    const iso =
      period === 'custom' && dateOverride
        ? dayjs(dateOverride).startOf('day').toISOString()
        : dayjs().toISOString()

    const data = await window.qadence.round(iso, period === 'custom' ? 'day' : period)
    setReport(data)
  }

  useEffect(() => {
    load(range, customDate)
  }, [range, customDate])

  async function exportData(format) {
    const blob = new Blob(
      [format === 'csv' ? toCSV(report) : JSON.stringify(report, null, 2)],
      { type: format === 'csv' ? 'text/csv' : 'application/json' }
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `qadence_${report.period}_${dayjs().format('YYYYMMDD')}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  function toCSV(r) {
    const headers = ['App', 'Title', 'Raw Minutes', 'Rounded Minutes']
    const rows = r.entries.map(e => [
      e.app,
      e.title,
      Math.round(e.seconds / 60),
      e.rounded_minutes,
    ])
    return [headers.join(','), ...rows.map(x => x.join(','))].join('\n')
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>6-Minute Rounded Report</h2>

      <div style={{ marginBottom: 12 }}>
        <label>
          View:&nbsp;
          <select value={range} onChange={e => setRange(e.target.value)}>
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date</option>
          </select>
        </label>

        {range === 'custom' && (
          <input
            type="date"
            value={customDate}
            onChange={e => setCustomDate(e.target.value)}
          />
        )}

        {report && (
          <>
            &nbsp;&nbsp;
            <button onClick={() => exportData('csv')}>Export CSV</button>
            <button onClick={() => exportData('json')} style={{ marginLeft: 8 }}>
              Export JSON
            </button>
          </>
        )}
      </div>

      {!report ? (
        <div>Loading…</div>
      ) : (
        <>
          <p>
            Period: {report.period} ({dayjs(report.base).format('YYYY-MM-DD')}) — Total:{' '}
            <b>{report.total_minutes} min</b>
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>App</th>
                <th style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>Title</th>
                <th style={{ borderBottom: '1px solid #444', textAlign: 'right' }}>Raw (min)</th>
                <th style={{ borderBottom: '1px solid #444', textAlign: 'right' }}>Rounded (min)</th>
              </tr>
            </thead>
            <tbody>
              {report.entries.map((e, i) => (
                <tr key={i}>
                  <td>{e.app}</td>
                  <td>{e.title}</td>
                  <td style={{ textAlign: 'right' }}>{Math.round(e.seconds / 60)}</td>
                  <td style={{ textAlign: 'right' }}>{e.rounded_minutes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
