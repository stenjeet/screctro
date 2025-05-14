import { app as o, BrowserWindow as a, globalShortcut as u, ipcMain as l, desktopCapturer as w, Notification as _ } from "electron";
import { fileURLToPath as P } from "node:url";
import n from "node:path";
import * as r from "node:fs";
const d = n.dirname(P(import.meta.url));
process.env.APP_ROOT = n.join(d, "..");
const c = process.env.VITE_DEV_SERVER_URL, b = n.join(process.env.APP_ROOT, "dist-electron"), p = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = c ? n.join(process.env.APP_ROOT, "public") : p;
let e;
function h() {
  const t = n.join(process.env.VITE_PUBLIC || "", "electron-vite.svg");
  e = new a({
    icon: t,
    height: 700,
    webPreferences: {
      preload: n.join(d, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0,
      webSecurity: !1
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), c ? e.loadURL(c) : e.loadFile(n.join(p, "index.html"));
}
o.on("window-all-closed", () => {
  process.platform !== "darwin" && (o.quit(), e = null);
});
o.on("activate", () => {
  a.getAllWindows().length === 0 && h();
});
o.whenReady().then(() => {
  h(), u.register("PrintScreen", () => {
    e == null || e.webContents.send("take-screenshot");
  });
});
l.handle("get-screen-sources", async () => await w.getSources({
  types: ["screen"],
  thumbnailSize: { width: 1920, height: 1080 }
}));
l.handle("save-screenshot", async (t, f) => {
  const s = n.join(o.getPath("pictures"), "MyScreenshots");
  r.existsSync(s) || r.mkdirSync(s);
  const i = n.join(s, `screenshot-${Date.now()}.png`), m = Buffer.from(f.replace(/^data:image\/\w+;base64,/, ""), "base64");
  return new _({
    title: "Успешно",
    body: `Скриншот сохранен${i}`
  }).show(), r.writeFileSync(i, m), i;
});
export {
  b as MAIN_DIST,
  p as RENDERER_DIST,
  c as VITE_DEV_SERVER_URL
};
