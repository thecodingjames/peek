const { ipcMain } = require('electron')
const { lookup } = require('dns/promises');

function registerHttp() {
  ipcMain.handle('http', async (_, { url, ...options }) => {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.text()
  })
}

module.exports = registerHttp
