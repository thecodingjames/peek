const { contextBridge, ipcRenderer } = require('electron/renderer')

const development = process.argv.includes('--dev')
const darwin = process.platform.includes('darwin')

contextBridge.exposeInMainWorld('electron', {

  app: async () => {
    const app = await ipcRenderer.invoke('app')

    return {
      ...app,
      development,
      darwin,
    }
  },

  http: (options) => ipcRenderer.invoke('http', options),

  openBrowser: (url) => ipcRenderer.invoke('openBrowser', url),
})

