const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('src/index.html')

  const watchPaths = [                                                                                                               
    path.join(__dirname, 'src')                                                                                                      
  ];                                                                                                                                 
                                                                                                                                     
  watchPaths.forEach(watchPath => {                                                                                                  
    fs.watch(watchPath, { recursive: true }, (eventType, filename) => {                                                              
      if (filename) {                                                                                                                
        console.log(`[Live Reload] File changed: ${filename}. Reloading...`);                                                        
        mainWindow.reload();                                                                                                         
      }                                                                                                                              
    });                                                                                                                              
  });
}

app.whenReady().then(() => {
  createWindow()
})
