import React from 'react'
import RoundedReport from './RoundedReport'
import ActivityLog from './ActivityLog'
import TimelineChart from './TimelineChart'

export default function Dashboard() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, padding: 16 }}>
      <div>
        <RoundedReport />
        <TimelineChart />
      </div>
      <div>
        <ActivityLog />
      </div>
    </div>
  )
}
