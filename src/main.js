const { app, BrowserWindow, ipcMain } = require('electron')

const registerHttp = require('./main-ipc-http.js')
registerHttp()

const path = require('path');
const fs = require('fs');

const DEVELOPMENT = !app.isPackaged

app.whenReady().then(() => {
  const window = createWindow()

  if (DEVELOPMENT) {
    liveReload(window)
    window.openDevTools()
  }
})

function createWindow() {
  const window = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      additionalArguments: DEVELOPMENT ? ['--dev'] : [],
      preload: path.join(__dirname, 'preload.js'),
      partition: `persist:${app.getName()}`,
    }
  })

  window.setMenuBarVisibility(false)

  window.loadFile(path.join(__dirname, 'index.html'))

  return window
}

function liveReload(window) {
  fs.watch(__dirname, { recursive: true }, (eventType, filename) => {
    if (filename) {
      window.reload();
    }
  });
}
