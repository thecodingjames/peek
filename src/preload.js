const { contextBridge, ipcRenderer } = require('electron/renderer')

const development = process.argv.includes('--dev')

contextBridge.exposeInMainWorld('electron', {
  development,
  appVersion: () => ipcRenderer.invoke('appVersion'),
  http: (options) => ipcRenderer.invoke('http', options) 
})

