const {
  ipcMain,
  webContents,
  session,
  BrowserWindow,
  shell,
} = require("electron");
const { API } = require("./api");
const { EnvironmentManager } = require("./manageEnvironment");

class IpcApi {
  environmentManager;
  currentWindow;
  backgroundWindows = [];
  mainWindow;
  constructor() {
    this.environmentManager = new EnvironmentManager();
    ipcMain.handle(API.ENV.GET_ALL, (e, ...args) =>
      this.getEnvironments.call(this, ...args),
    );
    ipcMain.handle(API.ENV.ADD, (e, ...args) =>
      this.addEnvironment.call(this, ...args),
    );
    ipcMain.handle(API.ENV.APP.ADD, (e, ...args) =>
      this.addApplication.call(this, ...args),
    );
    ipcMain.handle(API.ENV.APP.REMOVE, (e, ...args) =>
      this.removeApplication.call(this, ...args),
    );
    ipcMain.handle(API.ENV.REMOVE, (e, ...args) =>
      this.removeEnvironment.call(this, ...args),
    );
    ipcMain.handle(API.OPEN_EXTERNAL, (e, ...args) =>
      this.openExternal.call(this, ...args),
    );
    ipcMain.handle(API.BACKGROUND_THROTTLE, (e, ...args) =>
      this.hide.call(this, ...args),
    );
  }
  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow;
  }
  getEnvironments() {
    return this.environmentManager.getEnvironments();
  }
  addEnvironment({ name }) {
    console.log(name);
    return this.environmentManager.addNewEnvironment(name);
  }
  removeEnvironment({ id }) {
    return this.environmentManager.removeEnvironment(id);
  }
  removeApplication({ envId, id }) {
    return this.environmentManager.removeApplication(envId, id);
  }
  addApplication({ envId, name, url }) {
    console.log(envId, name, url);
    const app = this.environmentManager.addApplication(envId, {
      name: name,
      url: url,
    });
    return app;
  }
  async openExternal(url) {
    await shell.openExternal(url);
  }
  hide(webcontentsId, shouldHide) {
    const contents = webContents.fromId(webcontentsId);
    console.log(webcontentsId, shouldHide, contents.mainFrame.visibilityState);
    if (shouldHide) {
      contents.mainFrame.executeJavaScript('document.visibilityState="hidden"');
    } else {
      contents.mainFrame.executeJavaScript(
        'document.visibilityState="visible"',
      );
      //contents.emit("GUEST_INSTANCE_VISIBILITY_CHANGE", "visible");
      //contents.visibilityState = "visible";
    }
  }
  // TODO: remove? might be obsolete, though popups?
  showApplication({ envId, id }) {
    this.hideCurrentApplication();
    const app =
      this.backgroundWindows.find((record) => {
        return record.envId === envId && record.id === id;
      }) ?? this.environmentManager.getApplication(envId, id);
    if (!app.view) {
      const persist = "persist:" + envId;
      const sess = session.fromPartition(persist);
      let agent = null;
      if (app.url.indexOf("teams.microsoft") !== -1) {
        console.log("teams, switch agents");
        agent =
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36";
      }
      const view = new BrowserWindow({
        webPreferences: {
          session: sess,
          nodeIntegration: true,
        },
      });
      view.setBounds({
        x: 100,
        y: 0,
        width: this.mainWindow.getBounds().width - 100,
        height: this.mainWindow.getBounds().height - 25,
      });
      view.webContents.loadURL(app.url, {
        userAgent: agent,
      });
      view.setAutoResize({
        width: true,
        height: true,
      });
      this.currentWindow = view;
      this.mainWindow.addBrowserView(view);
      app.view = view;
      this.backgroundWindows.push(app);
    } else {
      this.currentWindow = app.view;
      app.view.setBounds({
        x: 100,
        y: 0,
        width: this.mainWindow.getBounds().width - 100,
        height: this.mainWindow.getBounds().height,
      });
      app.view.setAutoResize({ width: true, height: true });
    }
  }
  hideCurrentApplication() {
    if (!this.currentWindow) {
      return;
    }

    this.currentWindow.setAutoResize({ width: false, height: false });
    this.currentWindow.setBounds({ x: 100, y: 0, width: 0, height: 0 });
  }
}
module.exports = {
  IpcApi,
};
