import { app } from 'electron';
import Store from 'electron-store';



const store = new Store();


export function getNotification(): boolean | undefined {
	return store.get('notification') as boolean | undefined;
}

export function setNotification(enable: boolean) {
	store.set('notification', enable);
}



export function getTheme() {
	return store.get('theme') || 'dark';
}

export function setTheme(theme: string) {
	store.set('theme', theme);
}



export function getLaunguage() {
	return store.get('lang') || 'en';
}

export function setLanguage(lang: string) {
	store.set('lang', lang);
}


export function getAutoStart() {
	const saved = store.get('autoStart') as boolean | null | undefined;
	const sys = app.getLoginItemSettings().openAtLogin;

	return saved !== undefined ? saved : sys;
}

export function setAutoStart(enable: boolean) {
	store.set('autoStart', enable);
	app.setLoginItemSettings({
		openAtLogin: enable,
		path: app.getPath('exe'),
	});
}

export function initAutoStart() {
	const savedAutoStart = store.get('autoStart') as boolean | null | undefined;
	const systemAutoStart = app.getLoginItemSettings().openAtLogin;
	const isAutoStart = savedAutoStart != null ? savedAutoStart : systemAutoStart;
	
	if (isAutoStart !== systemAutoStart) {
		app.setLoginItemSettings({
			openAtLogin: isAutoStart,
			path: app.getPath('exe'),
		});
	}
  
	return isAutoStart;
}