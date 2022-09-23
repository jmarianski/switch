// Modules to control application life and create native browser window
const { IpcApi } = require("./ipc");
const {
  app,
  BrowserWindow,
  BrowserView,
  session,
  desktopCapturer,
} = require("electron");
const path = require("path");
const IpcApiObj = new IpcApi();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log(process.env.NODE_ENV);
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== undefined
  ) {
    mainWindow.loadURL("http://localhost:3000", {});
  } else {
    mainWindow.loadFile("build/index.html");
  }
  IpcApiObj.setMainWindow(mainWindow);
}

app.whenReady().then(() => {
  createWindow();
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      console.log(sources);
      for (const source of sources) {
        if (source.name === "Electron") {
          mainWindow.webContents.send("SET_SOURCE", source.id);
          return;
        }
      }
    });

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
