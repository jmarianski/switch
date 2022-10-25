const { contextBridge, ipcRenderer } = require("electron");
const functions = [
  { function: "getEnvironments", endpoint: "env-get-all" },
  { function: "addEnvironment", endpoint: "env:add" },
  { function: "addApplication", endpoint: "env:app:add" },
  { function: "removeEnvironment", endpoint: "env:remove" },
  { function: "removeApplication", endpoint: "env:app:remove" },
  { function: "showApplication", endpoint: "env:app:show" },
  { function: "hideCurrentWebView", endpoint: "env:app:hide:current" },
  { function: "openExternal", endpoint: "open-external" },
  { function: "backgroundThrottle", endpoint: "background-throttle" },
];
const toExpose = {};

for (const k in functions) {
  toExpose[functions[k].function] = (...args) =>
    ipcRenderer.invoke(functions[k].endpoint, ...args);
}
toExpose.dirname = __dirname;

contextBridge.exposeInMainWorld("electron", toExpose);
