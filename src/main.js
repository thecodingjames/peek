const { app, BrowserWindow } = require('electron')
const path = require('path');
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('src/index.html')

  const watchPaths = [                                                                                                               
    path.join(__dirname, '')                                                                                                      
  ];                                                                                                                                 
                                                                                                                                     
  watchPaths.forEach(watchPath => {                                                                                                  
    fs.watch(watchPath, { recursive: true }, (eventType, filename) => {                                                              
      if (filename) {                                                                                                                
        win.reload();                                                                                                         
      }                                                                                                                              
    });                                                                                                                              
  });
}

app.whenReady().then(() => {
  createWindow()
})
