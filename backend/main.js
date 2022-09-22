// Modules to control application life and create native browser window
const { IpcApi } = require("./ipc");
const { app, BrowserWindow, BrowserView, session } = require("electron");
const path = require("path");
const IpcApiObj = new IpcApi();
app.commandLine.appendSwitch("ignore-gpu-blocklist", "enabled");
app.commandLine.appendSwitch("enable-pwa-full-code-cache", "enabled");
app.commandLine.appendSwitch("enable-desktop-pwas", "enabled");
app.commandLine.appendSwitch("enable-desktop-pwas-link-capturing", "enabled");
app.commandLine.appendSwitch("enable-webrtc-srtp-aes-gcm", "enabled");
app.commandLine.appendSwitch("enable-webrtc-srtp-encrypted-headers", "enabled");
app.commandLine.appendSwitch("enable-webrtc-stun-origin", "enabled");
app.commandLine.appendSwitch("WebRtcUseEchoCanceller3", "enabled");
app.commandLine.appendSwitch(
  "enable-webrtc-new-encode-cpu-load-estimator",
  "enabled",
);
app.commandLine.appendSwitch(
  "enabble-webrtc-h264-with-openh264-ffmpeg",
  "enabled",
);
app.commandLine.appendSwitch("enable-parallel-downloading", "enabled");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
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

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
