import { ipcMain } from "electron";
import { saveScreenshot, getScreenSource } from "../services/screenshotService";



export function screenshotIPC () {
	ipcMain.handle('save-screenshot', async (_, base64: string) => {
		const filePath = await saveScreenshot(base64);
		return filePath;
	});

	ipcMain.handle('get-screen-source', async () => getScreenSource());
}