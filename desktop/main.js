const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // Disables the default window frame, including navbar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Allows you to use Node.js features in your renderer process (use with caution)
      contextIsolation: false // Disables the context isolation, but be cautious for security reasons
    }
  });

  // Load your webpage
  // if(isDev){
    // win.loadURL("http://localhost:5173/");
  // }
  // win.loadFile(path.join(__dirname, "dist", "index.html"));
  win.loadFile("index.html")

  // Optionally show window after it's ready
  win.once('ready-to-show', () => {
    win.show();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
