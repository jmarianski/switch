const { webFrame, contextBridge, ipcRenderer } = require("electron");

function expose() {
  function onClick() {
    window.electron.sendToHost("notification_clicked");
  }
  const Notification = new Proxy(window.Notification, {
    construct: (target, args) => {
      console.log(target, args);
      window.electron.sendToHost("notification_opened");

      const notif = new target(...args);
      notif.onclick = onClick;

      return notif;
    },
    set(obj, prop, value) {
      if (prop === "onclick") {
        obj[prop] = (...args) => {
          onClick(...args);
          value(...args);
        };
      } else {
        Reflect.set(...arguments);
      }
    },
  });
  window.Notification = Notification;
}

webFrame.executeJavaScript(expose.toString() + "; expose();");

contextBridge.exposeInMainWorld("electron", {
  sendToHost: (...data) => {
    return ipcRenderer.sendToHost(...data);
  },
});
