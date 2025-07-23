import { app, BrowserWindow, clipboard, desktopCapturer, dialog, globalShortcut, ipcMain, Menu, nativeImage, Notification, screen, shell, Tray, } from 'electron'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as fs from 'node:fs';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';



app.setAppUserModelId('com.stenjeet.screenshot');


const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;


let win: BrowserWindow | null;
let overlay: BrowserWindow | null;
let tray: Tray;
let isQuitting: boolean = false;
const store = new Store();



function createWindow() {
	const iconPath = path.join(process.env.VITE_PUBLIC || '', 'screenshot_logo.ico')
  
  	win = new BrowserWindow({
    	icon: iconPath,
    	height: 600,
		width: 1000,
		resizable: false,
	 	fullscreenable: false,
		show: false,
		autoHideMenuBar: true,
    	webPreferences: {
      		preload: path.join(__dirname, 'preload.mjs'),
      		nodeIntegration: false,
      		contextIsolation: true,
      		webSecurity: false,
			devTools: false,
    	},
  	});

  	// Test active push message to Renderer-process.
  	win.webContents.on('did-finish-load', () => {
    	win?.webContents.send('main-process-message', (new Date).toLocaleString())
  	});

  	if (VITE_DEV_SERVER_URL) {
    	win.loadURL(VITE_DEV_SERVER_URL)
  	} else {
    	// win.loadFile('dist/index.html')
    	win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  	};

	app.on('before-quit', () => {
  		isQuitting = true;
	});

	win.on('close', (event) => {
  		if (!isQuitting) {
    	event.preventDefault();
    	win?.hide();
  		}
	});
};


function overlayWindow() {
	const cursorPoint = screen.getCursorScreenPoint()
  	const display = screen.getDisplayNearestPoint(cursorPoint);
	const { bounds} = display;


	overlay = new BrowserWindow({
		x: bounds.x,
		y: bounds.y,
		width: bounds.width,
		height: bounds.height,
		fullscreen: true,
		transparent: true,
		resizable: false,
		alwaysOnTop: false,
		frame: false,
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
      		nodeIntegration: false,
      		contextIsolation: true,
      		webSecurity: true,
			devTools: false,
		}
	});

	if (VITE_DEV_SERVER_URL) {
   		overlay.loadURL(`${VITE_DEV_SERVER_URL}#/overlay`)
  	} else {
    	overlay.loadFile(path.join(RENDERER_DIST, 'index.html'), {
			hash: 'overlay'
		});
  	};
};

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
    	app.quit()
    	win = null
  	};
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
    	createWindow()
  	};
});

app.whenReady().then(() => {
	createWindow();
	trayMenu()

	globalShortcut.register('PrintScreen', () => {
		win?.webContents.send('take-screenshot');
	});
	globalShortcut.register('Control+PrintScreen', () => {
		overlayWindow()
	});
});



ipcMain.handle('get-auto-start', () => {
	const saved = store.get('autoStart') as boolean | null | undefined;
	const sys = app.getLoginItemSettings().openAtLogin;
	return saved !== undefined ? saved : sys;
});

ipcMain.handle('set-auto-start', (_, enable: boolean) => {
	store.set('autoStart', enable);
  	app.setLoginItemSettings({
    	openAtLogin: enable,
    	path: app.getPath('exe'),
  	});
  	rebuildTray(enable)
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

	// screenshotDir = path.join(app.getPath('pictures'), 'MyScreenshots');
	// if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

	const filePath = await saveScreenshot(base64);

	return filePath;
});

ipcMain.handle('get-screenshot-files', async () => {
	let ScreenshotDir = store.get('screenshotDir') as string | undefined;

	if (!ScreenshotDir) {
		ScreenshotDir = path.join(app.getPath('pictures'), 'MyScreenshots');
		 store.set('screenshotDir', ScreenshotDir);
	}

	const files = fs.readdirSync(ScreenshotDir)
		.filter(file => file.endsWith('.png'))
		.map(file => ({
			name: file,
			path: path.join(ScreenshotDir, file),
		}));
	
	return files;
});

ipcMain.handle('set-selection-area', async (_, area) => {

	if (overlay) {
    	overlay.close();
    	overlay = null;
  	}

  	const cursorPoint = screen.getCursorScreenPoint();
  	const display = screen.getDisplayNearestPoint(cursorPoint);

  	const sources = await desktopCapturer.getSources({
    	types: ['screen'],
    	thumbnailSize: display.size,
  	});

  	const source = sources.find(s => s.display_id === display.id.toString());
  	if (!source) throw new Error('Screen source not found');

  	const fullImage = source.thumbnail;
  	const cropped = fullImage.crop({
    	x: area.x,
    	y: area.y,
    	width: area.width,
    	height: area.height,
  	});

  	const base64 = cropped.toDataURL();
  	const filePath = await saveScreenshot(base64);

  	return filePath;
});

ipcMain.handle('get-notification', () => {
  const saved = store.get('notification') as boolean | undefined;
  return saved ?? true; // можно дефолт true или false
});

ipcMain.handle('set-notification', (_,enable) => {
	  store.set('notification', enable);
});

ipcMain.handle('open-screenshot', async(_, path) => {
	await shell.openPath(path);
});

ipcMain.on("open-folder-dialog", async (event) => {

  	const { canceled, filePaths } = await dialog.showOpenDialog({
    	properties: ["openDirectory"]
  	});

  	if (!canceled && filePaths.length > 0) {
		const selectedPath = filePaths[0];
		store.set('screenshotDir', selectedPath);
    	event.reply("selected-folder", selectedPath);
  	};
});

ipcMain.handle('get-screenshot-folder', () => {
	const dir = store.get('screenshotDir') as string | undefined;
  	return dir ?? path.join(app.getPath('pictures'), 'MyScreenshots');
});

ipcMain.handle('get-theme', () => {
	return store.get('theme') || 'dark';
});

ipcMain.handle('set-theme', (_, theme) => {
	store.set('theme', theme);
});

ipcMain.handle('get-lang', () => {
	return store.get('lang') || 'en';
});

ipcMain.handle('set-lang', (_, lang) => {
	store.set('lang', lang);
});



const savedAutoStart = store.get('autoStart') as boolean | null | undefined;

const systemAutoStart = app.getLoginItemSettings().openAtLogin;

const isAutoStart = savedAutoStart != null ? savedAutoStart : systemAutoStart;

if (isAutoStart !== systemAutoStart) {
  app.setLoginItemSettings({
    openAtLogin: isAutoStart,
    path: app.getPath('exe')
  });
};


function trayMenu() {

	const iconPath = path.join(process.env.VITE_PUBLIC || '', 'screenshot_logo.ico');
	tray = new Tray(iconPath);

	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Autostart',
			type: 'checkbox',
			checked: isAutoStart,
			click: (menuItem) => {
				const enable = menuItem.checked;

			store.set('autoStart', enable);

				app.setLoginItemSettings({
					openAtLogin: enable,
					path: app.getPath('exe')
				})
			}
		},
		{ label: 'Quit', click: () => {
    		isQuitting = true; 
    		app.quit();
  		}}
	]);

	tray.on('click', () => {
    	win?.show();
  	});

	tray.setToolTip('');
	tray.setContextMenu(contextMenu);
};

function rebuildTray(isAutoStart: boolean) {

	const contextMenu = Menu.buildFromTemplate([
    	{
      		label: 'Autostart',
      		type: 'checkbox',
      		checked: isAutoStart,
      		click: (menuItem) => {
        		const enable = menuItem.checked;
        		store.set('autoStart', enable);
        		app.setLoginItemSettings({
          			openAtLogin: enable,
          			path: app.getPath('exe'),
        		});
      		},
    },
    	{ label: 'Quit', click: () => {
    		isQuitting = true; 
    		app.quit();
  		}}
  ]);

  tray.setContextMenu(contextMenu);
};



async function saveScreenshot(base64: string) {

	let newScreenshotDir = store.get('screenshotDir') as string | undefined;

	if (!newScreenshotDir) {
		newScreenshotDir = path.join(app.getPath('pictures'), 'MyScreenshots');
		store.set('screenshotDir', newScreenshotDir);
	}

  	if (!fs.existsSync(newScreenshotDir)) fs.mkdirSync(newScreenshotDir);

  	const filePath = path.join(newScreenshotDir, `Screenshot-${Date.now()}.png`);
  	const buffer = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');

  	fs.writeFileSync(filePath, buffer);

	const isNotificationEnabled = store.get('notification') as boolean | undefined;

	if (isNotificationEnabled) {
    	// лучше с __dirname
    	const iconPath = path.join(__dirname, 'screenshot_logo.ico');

    	const notification = new Notification({
      		title: "Screenshot saved",
      		body: `Saved to ${filePath}`,
      		icon: iconPath,
    	});

    	notification.show();
};

	const img = nativeImage.createFromBuffer(buffer);
  	clipboard.writeImage(img);

  	return filePath;
};



// update (electron updater)

ipcMain.on('check-for-updates', () => {
  	autoUpdater.checkForUpdates();
});

autoUpdater.on('update-downloaded', () => {
	dialog.showMessageBox({
    	type: 'info',
    	title: 'Update',
    	message: 'New update available. Restart now?',
    	buttons: ['Yes', 'Later'],
    	defaultId: 0,
    	cancelId: 1,
		noLink: true
  	}).then(result => {
    	if (result.response === 0) autoUpdater.quitAndInstall();
  	});
});

autoUpdater.on('update-not-available', () => {
	dialog.showMessageBox({
    	type: 'info',
    	title: 'Update',
    	message: 'No updates available',
  	})
})