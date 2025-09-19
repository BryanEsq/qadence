// src/utils/appNames.js

// Normalize raw process names like "WINWORD.EXE" → "winword"
function normalizeProcName(proc) {
  if (!proc) return ''
  const p = String(proc).toLowerCase().trim()
  return p.endsWith('.exe') ? p.slice(0, -4) : p
}

// Map normalized process name → friendly label
export function friendlyAppName(proc) {
  const key = normalizeProcName(proc)

  // Common Windows app/process names you’ll see in logs
  const map = {
    // Microsoft 365
    outlook: 'Outlook',
    olk: 'Outlook',
    winword: 'MS Word',
    word: 'MS Word',
    excel: 'MS Excel',
    powerpnt: 'PowerPoint',
    onenote: 'OneNote',
    teams: 'MS Teams',

    // Browsers
    msedge: 'MS Edge',
    chrome: 'Chrome',
    firefox: 'Firefox',

    // Dev / PDF / Utilities
    code: 'VS Code',
    acrord32: 'Adobe Reader',
    notepad: 'Notepad',
    explorer: 'File Explorer',

    // Misc
    slack: 'Slack',
    thunderbird: 'Thunderbird',
    postman: 'Postman',
    electron: 'Qadence', // show your own app nicely
  }

  return map[key] || (proc ? proc : 'Unknown')
}

// Clean window titles so browsers only show site/page name (no profile, no browser suffix)
export function cleanTitle(app, title) {
  if (!title) return ''
  const key = normalizeProcName(app)

  // Strip " - Profile X" (with -, –, —) anywhere
  let t = title.replace(/\s[-–—]\sProfile\s+\d+/gi, '').trim()

  // Strip trailing browser name (with -, –, — and possible extra text)
  t = t.replace(/\s[-–—]\s(Microsoft\sEdge|Google\sChrome|Mozilla\sFirefox)(\s.*)?$/i, '').trim()

  // For browsers, prefer the first segment before " - "
  if (['msedge', 'chrome', 'firefox'].includes(key)) {
    const parts = t.split(/\s[-–—]\s/)
    return (parts[0] || t).trim()
  }

  return t
}
