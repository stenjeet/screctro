import { BrowserWindow, app } from "electron";
import path from "path";
import { PRELOAD_PATH, VITE_DEV_SERVER_URL, RENDERER_DIST, ICON_PATH } from '../paths';



let win: BrowserWindow | null;


export function createWindow(isQuitting: boolean) {
  
	win = new BrowserWindow({
		icon: ICON_PATH,
		height: 600,
		width: 1000,
		resizable: false,
		fullscreenable: false,
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: PRELOAD_PATH,
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: false,
			devTools: false,
		},
	});

	// Test active push message to Renderer-process.
	win.webContents.on('did-finish-load', () => {
		win?.webContents.send('main-process-message', (new Date).toLocaleString());
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	app.on('before-quit', () => {
		isQuitting = true;
	});

	win.on('close', (event) => {
		if (!isQuitting) {
			event.preventDefault();
			win?.hide();
		}
	});

	return win;
}