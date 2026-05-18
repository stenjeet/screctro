import { app, BrowserWindow,  globalShortcut } from 'electron';
import Store from 'electron-store';

import { setupUpdater } from './services/updaterService';
import  { createTray } from './services/trayService';
import { overlayWindow} from './services/overlayService';
import { createWindow } from './services/windowService';

import { registerOverlayIPC } from './ipc/overlayIPC';
import { registerSettingsIPC } from './ipc/settingsIPC';
import { registerFileIPC } from './ipc/fileIPC';
import { initAutoStart } from './services/settingsService';
import { screenshotIPC } from './ipc/screenshotIPC';
import { openLinkIPC } from './ipc/openLinkIPC';



// app.setAppUserModelId('com.stenjeet.Screctro');

const store = new Store();

let win: BrowserWindow | null;
const isQuitting: boolean = false;
let isAutoStart: boolean = store.get('autoStart') as boolean;




// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow(isQuitting)
	}
});

app.whenReady().then(() => {
	isAutoStart = initAutoStart();
	
	win = createWindow(isQuitting);
	createTray(win, isAutoStart);
	setupUpdater();

	// IPC
	registerOverlayIPC();
	registerSettingsIPC();
	registerFileIPC();
	screenshotIPC();
	openLinkIPC();



	globalShortcut.register('PrintScreen', () => {
		win?.webContents.send('take-screenshot');
	});
	globalShortcut.register('Control+PrintScreen', () => {
		overlayWindow()
	});
});