// Modules to control application life and create native browser window
const { IpcApi } = require("./ipc");
const {
  app,
  BrowserWindow,
  desktopCapturer,
  webFrameMain,
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
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  if (!app.isPackaged) {
    mainWindow.loadURL("http://localhost:3000", {});
  } else {
    mainWindow.loadFile("build/index.html");
  }

  IpcApiObj.setMainWindow(mainWindow);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("web-contents-created", function (webContentsCreatedEvent, contents) {
  contents.on(
    "did-frame-navigate",
    (
      event,
      url,
      httpResponsCode,
      httpStatusText,
      isMainFrame,
      frameProcessId,
      frameRoutingId,
    ) => {
      const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);
      console.log(
        event,
        url,
        httpResponsCode,
        httpStatusText,
        isMainFrame,
        frameProcessId,
        frameRoutingId,
      );
    },
  );
  contents.setMaxListeners(1000);

  if (contents.getType() === "webview") {
    contents.setWindowOpenHandler(function (details) {
      return { action: "allow" };
    });
  }
});
