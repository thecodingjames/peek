const { app, shell, ipcMain } = require('electron')

function registerHttp() {
  ipcMain.handle('http', async (_, { url, ...options }) => {

    try {
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
    } catch(error) {
      return { error }
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
