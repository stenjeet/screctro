import { app as n, BrowserWindow as f, globalShortcut as P, ipcMain as u, screen as p, desktopCapturer as w, Notification as S } from "electron";
import { fileURLToPath as _ } from "node:url";
import t from "node:path";
import * as c from "node:fs";
const h = t.dirname(_(import.meta.url));
process.env.APP_ROOT = t.join(h, "..");
const a = process.env.VITE_DEV_SERVER_URL, b = t.join(process.env.APP_ROOT, "dist-electron"), m = t.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = a ? t.join(process.env.APP_ROOT, "public") : m;
let e;
function g() {
  const s = t.join(process.env.VITE_PUBLIC || "", "electron-vite.svg");
  e = new f({
    icon: s,
    height: 700,
    webPreferences: {
      preload: t.join(h, "preload.mjs"),
      nodeIntegration: !0,
      contextIsolation: !0,
      webSecurity: !1
    }
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), a ? e.loadURL(a) : e.loadFile(t.join(m, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  f.getAllWindows().length === 0 && g();
});
n.whenReady().then(() => {
  g(), P.register("PrintScreen", () => {
    e == null || e.webContents.send("take-screenshot");
  });
});
u.handle("get-screen-source", async () => {
  const s = p.getCursorScreenPoint(), r = p.getDisplayNearestPoint(s), o = r.id.toString();
  return (await w.getSources({
    types: ["screen"],
    thumbnailSize: r.size
  })).find((d) => d.display_id === o);
});
u.handle("save-screenshot", async (s, r) => {
  const o = t.join(n.getPath("pictures"), "MyScreenshots");
  c.existsSync(o) || c.mkdirSync(o);
  const i = t.join(o, `screenshot-${Date.now()}.png`), l = Buffer.from(r.replace(/^data:image\/\w+;base64,/, ""), "base64");
  return new S({
    title: "Успешно",
    body: `Скриншот сохранен ${i}`
  }).show(), c.writeFileSync(i, l), i;
});
export {
  b as MAIN_DIST,
  m as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};
