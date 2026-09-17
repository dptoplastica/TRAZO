const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
    title: 'TRAZO - Programación Didáctica LOMLOE',
  });

  const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
  console.log('Cargando archivo:', indexPath);
  
  win.loadFile(indexPath).catch(function(err) {
    console.error('Error al cargar el archivo:', err);
  });
  
  win.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
