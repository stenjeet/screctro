"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  onScreenshot: (callback) => {
    electron.ipcRenderer.on("take-screenshot", callback);
  },
  saveScreenshot: (base64) => electron.ipcRenderer.invoke("save-screenshot", base64),
  getScreenSource: () => electron.ipcRenderer.invoke("get-screen-source"),
  getScreenshotFiles: () => electron.ipcRenderer.invoke("get-screenshot-files")
  // area screenshot
  // areaScrenshot: (callback: () => void) => {
  // 	ipcRenderer.on('take-area-screenshot', callback)
  // } 
});
