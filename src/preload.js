const { contextBridge, ipcRenderer } = require('electron/renderer')

const development = process.argv.includes('--dev');

contextBridge.exposeInMainWorld('electron', {
  development,
  http: (options) => ipcRenderer.invoke('http', options) 
})

