const { app, shell, ipcMain } = require('electron')
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

function registerApp() {

  ipcMain.handle('app', (_) => {
    const version = app.getVersion()

    return {
      version,
      repoUrl: 'https://github.com/thecodingjames/peek'
    }
  })

}

function registerOpenBrowser() {

  ipcMain.handle('openBrowser', (_, url) => {
    const version = app.getVersion()

    shell.openExternal(url)
  })

}

module.exports = function() {
  registerHttp()
  registerApp()
  registerOpenBrowser()
}
