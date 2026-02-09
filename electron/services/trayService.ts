import { BrowserWindow, Tray, Menu, app } from "electron";
import Store from "electron-store";
import { ICON_PATH } from "../paths";


let tray: Tray;
const store = new Store;


export function createTray(win: BrowserWindow | null, isAutoStart: boolean) {
	tray = new Tray(ICON_PATH);

	const contextMenu = buildMenu(isAutoStart);

	tray.on('click', () => {
		win?.show();
	});

	tray.setToolTip('');
	tray.setContextMenu(contextMenu);

	return tray;
}


export function rebuildTray(isAutoStart: boolean) {
	if (!tray) return;

	const menu = buildMenu(isAutoStart);
	tray.setContextMenu(menu);
}


function buildMenu(isAutoStart: boolean) {
	return Menu.buildFromTemplate([
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
			}
		},
		{ 
			label: 'Quit',
			click: () => {
				app.quit();
			}
		}
	]);
}