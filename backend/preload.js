const { contextBridge, ipcRenderer } = require("electron");
const functions = [
  { function: "getEnvironments", endpoint: "env-get-all" },
  { function: "addEnvironment", endpoint: "env:add" },
  { function: "addApplication", endpoint: "env:app:add" },
  { function: "removeEnvironment", endpoint: "env:remove" },
  { function: "removeApplication", endpoint: "env:app:remove" },
  { function: "showApplication", endpoint: "env:app:show" },
  { function: "hideCurrentWebView", endpoint: "env:app:hide:current" },
];
const toExpose = {};

for (const k in functions) {
  toExpose[functions[k].function] = (...args) =>
    ipcRenderer.invoke(functions[k].endpoint, ...args);
}

contextBridge.exposeInMainWorld("electron", toExpose);
