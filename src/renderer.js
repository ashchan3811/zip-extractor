// renderer.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  selectFolder: (type) => ipcRenderer.invoke("select-folder", type),
  extractZips: (data) => ipcRenderer.invoke("extract-zips", data),
});
