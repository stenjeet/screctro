import { ipcMain, shell } from "electron";

export function openLinkIPC() {
  ipcMain.on("open-link", (_, url: string) => shell.openExternal(url));
}
