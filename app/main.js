// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron'),
  path = require('path'),
  url = require('url');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: '#319ce7'
  });

  mainWindow.maximize();

  const startURL = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/ui/index.html'),
    protocol: 'file:',
    slashes: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(startURL);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });
});

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');
app.commandLine.appendSwitch('high-dpi-support', 'true');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});