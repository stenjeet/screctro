import { ipcMain } from "electron";
import {
	getNotification,
	setNotification,
	getTheme,
	setTheme,
	getLaunguage,
	setLanguage,
	getAutoStart,
	setAutoStart,
} from '../services/settingsService';
import { rebuildTray } from "../services/trayService";


export function registerSettingsIPC() {
	ipcMain.handle('get-notification', () => getNotification());
	ipcMain.handle('set-notification', (_, enable: boolean) => setNotification(enable));

	ipcMain.handle('get-theme', () => getTheme());
	ipcMain.handle('set-theme', (_, theme: string) => setTheme(theme));

	ipcMain.handle('get-lang', () => getLaunguage());
	ipcMain.handle('set-lang', (_, lang: string) => setLanguage(lang));

	ipcMain.handle('get-auto-start', () => getAutoStart());
	ipcMain.handle('set-auto-start', (_, enable: boolean) => {
		setAutoStart(enable);
		rebuildTray(enable);
	});
}