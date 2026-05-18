import { ipcMain } from 'electron';
import {
	openScreenshot,
	deleteScreenshot,
	selectScreenshotFolder,
	getScreenshotFolder,
	getScreenshotFiles
} from '../services/fileService';



export function registerFileIPC() {
	ipcMain.handle('open-screenshot', (_, filePath: string) => openScreenshot(filePath));
	ipcMain.handle('delete-screenshot', (_, filePath: string) => deleteScreenshot(filePath));

	ipcMain.on('open-folder-dialog', async(event) => {
		const selectedPath = await selectScreenshotFolder();
		if (selectedPath) {
			event.reply('selected-folder', selectedPath);
		}
	});

	ipcMain.handle('get-screenshot-folder', () => getScreenshotFolder());

	ipcMain.handle('get-screenshot-files', async () => getScreenshotFiles());
}