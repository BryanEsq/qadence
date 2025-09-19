// Normalize process names
export function friendlyAppName(proc) {
  if (!proc) return 'Unknown'

  const map = {
    olk: 'Outlook',
    outlook: 'Outlook',
    msedge: 'MS Edge',
    chrome: 'Chrome',
    firefox: 'Firefox',
    winword: 'MS Word',
    excel: 'MS Excel',
    powerpnt: 'PowerPoint',
    teams: 'MS Teams',
    slack: 'Slack',
    code: 'VS Code',
    acrord32: 'Adobe Reader',
  }

  const key = proc.toLowerCase()
  return map[key] || proc
}

// Clean up window/browser titles
export function cleanTitle(app, title) {
  if (!title) return ''

  const lower = app.toLowerCase()
  if (['msedge', 'chrome', 'firefox'].includes(lower)) {
    return title
      .replace(/\s-\sProfile\s\d+/gi, '') // strip “Profile X”
      .replace(/\s-\s(Microsoft\sEdge|Google\sChrome|Mozilla\sFirefox).*$/i, '') // strip browser name
      .trim()
  }

  return title
}
