import { app, BrowserWindow, desktopCapturer, globalShortcut, ipcMain, Notification } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as fs from 'node:fs'

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  const iconPath = path.join(process.env.VITE_PUBLIC || '', 'electron-vite.svg')
  
  win = new BrowserWindow({
    icon: iconPath,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
	createWindow();

	globalShortcut.register('PrintScreen', () => {
		win?.webContents.send('take-screenshot');
	});
});

ipcMain.handle('get-screen-sources', async() => {
	const sources = await desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: {width: 1920, height: 1080},
	});
	return sources;
});

ipcMain.handle('save-screenshot', async (_, base64: string) => {
	const screenshotDir = path.join(app.getPath('pictures'), 'MyScreenshots');
	if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

	const filePath = path.join(screenshotDir, `screenshot-${Date.now()}.png`);
	const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

	const notification = new Notification({
		title: "Успешно",
		body: `Скриншот сохранен${filePath}`
	})
	notification.show();

	fs.writeFileSync(filePath, buffer);
	return filePath;
})

