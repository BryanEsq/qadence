import { exec } from 'child_process'
import dayjs from 'dayjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { insertSession } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let timer = null
let current = null
const POLL_MS = 5000 // 5 seconds

export function startTracker() {
  if (timer) return
  console.log('🚀 Tracker started, polling every', POLL_MS, 'ms')
  timer = setInterval(tick, POLL_MS)
}

export function stopTracker() {
  if (timer) {
    clearInterval(timer)
    timer = null
    console.log('🛑 Tracker stopped')
  }
  commit(true)
}

function sameCtx(a, b) {
  if (!a || !b) return false
  return a.app === b.app && a.title === b.title
}

async function tick() {
  try {
    const info = await getActiveWindow()
    if (!info) {
      console.log('⚠️ No active window info returned')
      return
    }

    console.log('🎯 Active window:', info)

    const ctx = {
      app: info.ProcessName || 'Unknown',
      title: info.Title || ''
    }

    const now = dayjs()

    if (!current) {
      current = { ctx, start: now }
      console.log('🟢 New session started:', ctx)
      return
    }

    if (sameCtx(current.ctx, ctx)) {
      return
    } else {
      console.log('🔄 Context changed → committing old session')
      commit(false)
      current = { ctx, start: now }
    }
  } catch (err) {
    console.error('❌ Tracker error:', err)
  }
}

function commit(flush = false) {
  if (!current) return
  const end = dayjs()
  const dur = end.diff(current.start, 'second')
  if (dur >= 5) {
    console.log(
      `💾 Committing session: ${current.ctx.app} | ${current.ctx.title} | ${dur}s`
    )
    insertSession({
      app: current.ctx.app,
      title: current.ctx.title,
      filePath: '',
      start_ts: current.start.valueOf(),
      end_ts: end.valueOf(),
      duration_sec: dur
    })
  } else {
    console.log('⏭️ Ignoring short session (<5s)')
  }
  current = flush ? null : null
}

function getActiveWindow() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'get-active-window.ps1')
    exec(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { windowsHide: true },
      (err, stdout, stderr) => {
        if (err) {
          console.error('⚠️ PowerShell exec error:', err)
          return reject(err)
        }
        if (stderr && stderr.trim()) {
          console.error('⚠️ PowerShell stderr:', stderr)
        }

        console.log('📤 Raw PS output:', stdout)

        try {
          const trimmed = stdout.trim()
          if (!trimmed) return resolve(null)
          resolve(JSON.parse(trimmed))
        } catch (e) {
          console.error('❌ JSON parse failed, raw was:', stdout)
          resolve(null)
        }
      }
    )
  })
}
