const { app, ipcMain } = require('electron')
const { lookup } = require('dns/promises');

function registerHttp() {
  ipcMain.handle('http', async (_, { url, ...options }) => {
    const response = await fetch(url, options)

    const blob = await response.text()

    return {
      url: response.url,
      code: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
      redirected: response.redirected,
      blob,
    }
  })
}

function registerAppVersion() {
  ipcMain.handle('appVersion', () => {
    return app.getVersion()
  })
}

module.exports = function() {
  registerHttp()
  registerAppVersion()
}
