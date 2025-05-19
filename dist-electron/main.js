import { app, BrowserWindow, globalShortcut, ipcMain, screen, desktopCapturer, Notification, nativeImage, clipboard, Tray, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import * as fs from "node:fs";
app.setAppUserModelId("com.stenjeet.screenshot");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let tray;
let screenshotDir;
function createWindow() {
  win = new BrowserWindow({
    // icon: iconPath,
    height: 700,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
function trayMenu() {
  const isAutoStart = app.getLoginItemSettings().openAtLogin;
  const iconPath = path.join(process.env.VITE_PUBLIC || "", "tray-icon.png");
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "AutoStart",
      type: "checkbox",
      checked: isAutoStart,
      click: (menuItem) => {
        const enable = menuItem.checked;
        app.setLoginItemSettings({
          openAtLogin: enable,
          path: app.getPath("exe")
        });
      }
    },
    { label: "Quit", click: () => app.quit() }
  ]);
  tray.setToolTip("");
  tray.setContextMenu(contextMenu);
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  createWindow();
  trayMenu();
  globalShortcut.register("PrintScreen", () => {
    win == null ? void 0 : win.webContents.send("take-screenshot");
  });
});
ipcMain.handle("get-screen-source", async () => {
  const cursorPoint = screen.getCursorScreenPoint();
  const display = screen.getDisplayNearestPoint(cursorPoint);
  const targetDisplayId = display.id.toString();
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: display.size
  });
  const targetSource = sources.find((s) => s.display_id === targetDisplayId);
  return targetSource;
});
ipcMain.handle("save-screenshot", async (_, base64) => {
  screenshotDir = path.join(app.getPath("pictures"), "MyScreenshots");
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);
  const filePath = path.join(screenshotDir, `screenshot-${Date.now()}.png`);
  const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), "base64");
  const iconPath = path.join(process.env.VITE_PUBLIC || "", "tray-icon.png");
  const notification = new Notification({
    title: "Screenshot saved",
    body: `Saved to ${screenshotDir}`,
    icon: iconPath
  });
  notification.show();
  fs.writeFileSync(filePath, buffer);
  const img = nativeImage.createFromBuffer(buffer);
  clipboard.writeImage(img);
  return filePath;
});
ipcMain.handle("get-screenshot-files", async () => {
  if (!fs.existsSync(screenshotDir)) return [];
  const files = fs.readdirSync(screenshotDir).filter((file) => file.endsWith(".png")).map((file) => ({
    name: file,
    path: path.join(screenshotDir, file)
  }));
  return files;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
