import React from 'react'
import RoundedReport from './RoundedReport.jsx'
import ActivityLog from './ActivityLog.jsx'
import TimelineChart from './TimelineChart.jsx'

export default function Dashboard() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Qadence</h1>
        <p style={{ margin: 0, color: '#555' }}>
          Automatic time tracking with 6-minute rounding
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          <RoundedReport />
        </div>

        <div
          style={{
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
          }}
        >
          <ActivityLog />
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
        }}
      >
        <TimelineChart />
      </div>
    </div>
  )
}
