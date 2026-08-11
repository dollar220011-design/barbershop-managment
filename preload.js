const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("barberAPI", {
  login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
  changePassword: (data) => ipcRenderer.invoke("auth:changePassword", data),
  getData: () => ipcRenderer.invoke("data:get"),
  saveData: (data) => ipcRenderer.invoke("data:save", data),
  exportBackup: () => ipcRenderer.invoke("backup:export"),
  importBackup: () => ipcRenderer.invoke("backup:import")
});