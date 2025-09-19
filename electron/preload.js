// electron/preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('qadence', {
  dbPath: () => ipcRenderer.invoke('db:path'),
  sessionsBetween: (s, e) => ipcRenderer.invoke('db:sessionsBetween', { start: s, end: e }),
  summaries: (p) => ipcRenderer.invoke('db:summaries', { period: p }),
  round: (isoDate, period = 'day') =>
    ipcRenderer.invoke('db:round', { isoDate, period }),   // fixed to match main.js
  export: (f, o) => ipcRenderer.invoke('db:export', { format: f, options: o })
})
