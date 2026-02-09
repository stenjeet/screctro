import { dialog, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";



export function setupUpdater() {
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
		})
			.then(result => {
				if (result.response === 0) autoUpdater.quitAndInstall();
			});
	});

	autoUpdater.on('update-not-available', () => {
		dialog.showMessageBox({
			type: 'info',
			title: 'Update',
			message: 'No updates available',
		});
	});

	autoUpdater.on("error", (err) => {
		dialog.showErrorBox("Update error", err == null ? "unknown" : err.message);
	});
}