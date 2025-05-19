import { app, BrowserWindow, clipboard, desktopCapturer, globalShortcut, ipcMain, Menu, nativeImage, Notification, screen, Tray, } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as fs from 'node:fs'

app.setAppUserModelId('com.stenjeet.screenshot')

const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
// let overlay: BrowserWindow | null;
let tray;
let screenshotDir: string;

function createWindow() {
//   const iconPath = path.join(process.env.VITE_PUBLIC || '', 'tray-icon.png')
  
  win = new BrowserWindow({
    // icon: iconPath,
    height: 700,
	show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
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
};

// function overlayWindow() {
// 	 const cursorPoint = screen.getCursorScreenPoint()
//   	const display = screen.getDisplayNearestPoint(cursorPoint);
// 	const { bounds} = display;


// 	overlay = new BrowserWindow({
// 		x: bounds.x,
// 		y: bounds.y,
// 		width: bounds.width,
// 		height: bounds.height,
// 		fullscreen: true,
// 		// transparent: true,
// 		resizable: false,
// 		alwaysOnTop: true,
// 		frame: false,
// 		webPreferences: {
// 			preload: path.join(__dirname, 'preload.mjs'),
//       		nodeIntegration: true,
//       		contextIsolation: true,
//       		webSecurity: false,
// 		}
// 	})

// 	if (VITE_DEV_SERVER_URL) {
//    		overlay.loadURL(VITE_DEV_SERVER_URL)
//   	} else {
//     	overlay.loadFile(path.join(RENDERER_DIST, 'index.html'))
//   	}
// };

function trayMenu() {
	const isAutoStart = app.getLoginItemSettings().openAtLogin;

	const iconPath = path.join(process.env.VITE_PUBLIC || '', 'tray-icon.png');
	tray = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'AutoStart',
			type: 'checkbox',
			checked: isAutoStart,
			click: (menuItem) => {
				const enable = menuItem.checked;
				app.setLoginItemSettings({
					openAtLogin: enable,
					path: app.getPath('exe')
				})
			}
		},
		{label: 'Quit', click: () => app.quit()}
	]);

	tray.setToolTip('');
	tray.setContextMenu(contextMenu);
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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
	createWindow();
	trayMenu()

	globalShortcut.register('PrintScreen', () => {
		win?.webContents.send('take-screenshot');
	});
	// globalShortcut.register('Control+PrintScreen', () => {
	// 	win?.webContents.send('take-area-screenshot');
	// 	overlayWindow();
	// });
});

ipcMain.handle('get-screen-source', async() => {

	const cursorPoint = screen.getCursorScreenPoint();
	const display = screen.getDisplayNearestPoint(cursorPoint);
	const targetDisplayId = display.id.toString();

	const sources = await desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: display.size,
	});
	
	const targetSource = sources.find(s => s.display_id === targetDisplayId);

	return targetSource;
});

ipcMain.handle('save-screenshot', async (_, base64: string) => {
	screenshotDir = path.join(app.getPath('pictures'), 'MyScreenshots');
	if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

	const filePath = path.join(screenshotDir, `screenshot-${Date.now()}.png`);
	const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

	const iconPath = path.join(process.env.VITE_PUBLIC || '', 'tray-icon.png');
	const notification = new Notification({
		title: "Screenshot saved",
		body: `Saved to ${screenshotDir}`,
		icon: iconPath,
	})
	notification.show();

	fs.writeFileSync(filePath, buffer);

	const img = nativeImage.createFromBuffer(buffer);
  	clipboard.writeImage(img);

	return filePath;
});



ipcMain.handle('get-screenshot-files', async () => {
	if (!fs.existsSync(screenshotDir)) return [];

	const files = fs.readdirSync(screenshotDir)
		.filter(file => file.endsWith('.png'))
		.map(file => ({
			name: file,
			path: path.join(screenshotDir, file),
		}));
	
	return files;
});

