import { ipcRenderer, contextBridge } from "electron";
import { version } from "../package.json";

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

contextBridge.exposeInMainWorld("electronAPI", {
  onScreenshot: (callback: () => void) => {
    ipcRenderer.on("take-screenshot", callback);
  },
  getScreenSource: () => ipcRenderer.invoke("get-screen-source"),
  saveScreenshot: (base64: string) =>
    ipcRenderer.invoke("save-screenshot", base64),
  getScreenshotFiles: () => ipcRenderer.invoke("get-screenshot-files"),
  setSelectionArea: (area: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    ipcRenderer.invoke("set-selection-area", area);
  },
  openScreenshot: (path: string) => {
    ipcRenderer.invoke("open-screenshot", path);
  },
  deleteScreenshot: (path: string) => {
    ipcRenderer.invoke("delete-screenshot", path);
  },

  // screenshot folder store
  openFolderDialog: () => ipcRenderer.send("open-folder-dialog"),
  onSelectedFolder: (callback: (path: string) => void) =>
    ipcRenderer.on("selected-folder", (_, path) => callback(path)),
  getScreenshotFolder: () => ipcRenderer.invoke("get-screenshot-folder"),

  // autoStart store
  getAutoStart: () => ipcRenderer.invoke("get-auto-start"),
  setAutoStart: (enable: boolean) =>
    ipcRenderer.invoke("set-auto-start", enable),

  // notification store
  getNotification: () => ipcRenderer.invoke("get-notification"),
  setNotification: (enable: boolean) =>
    ipcRenderer.invoke("set-notification", enable),

  // theme store
  getTheme: () => ipcRenderer.invoke("get-theme"),
  setTheme: (theme: string) => ipcRenderer.invoke("set-theme", theme),

  // language store
  getLang: () => ipcRenderer.invoke("get-lang"),
  setLang: (lang: string) => ipcRenderer.invoke("set-lang", lang),

  // Updater
  checkForUpdates: () => ipcRenderer.send("check-for-updates"),

  // openLink
  openLink: (url: string) => ipcRenderer.send("open-link", url),
});

contextBridge.exposeInMainWorld("appVersion", {
  version,
});
