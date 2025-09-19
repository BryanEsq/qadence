import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { friendlyAppName } from '../utils/appNames'

export default function TimelineChart() {
  const [data, setData] = useState([])

  async function load() {
    try {
      const summary = await window.qadence.summaries('day')
      if (summary && summary.rows) {
        setData(
          summary.rows.map(r => ({
            app: friendlyAppName(r.app),
            minutes: Math.round(r.total_sec / 60),
          }))
        )
      } else {
        setData([])
      }
    } catch (err) {
      console.error('❌ Error loading timeline:', err)
      setData([])
    }
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: 16 }}>
      <h2>Timeline (Today by App)</h2>
      {data.length === 0 ? (
        <p>No activity recorded yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="app" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
