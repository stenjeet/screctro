import { dialog, shell, app } from "electron";
import Store from 'electron-store';
import path from "path";
import * as fs from "node:fs";



const store = new Store();


export async function openScreenshot(filePath: string) {
	await shell.openPath(filePath);
}

export async function deleteScreenshot(filePath: string) {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
}


export async function selectScreenshotFolder(): Promise<string | null> {
	const { canceled, filePaths } = await dialog.showOpenDialog({
		properties: ["openDirectory"]
	});

	if (!canceled && filePaths.length > 0) {
		const selectedPath = filePaths[0];
		store.set('screenshotDir', selectedPath);
		
		return selectedPath;
	}

	return null;
}


export function getScreenshotFolder(): string {
	const dir = store.get('screenshotDir') as string | undefined;
	return dir ?? path.join(app.getPath('pictures'), 'MyScreenshots');
}


export async function getScreenshotFiles() {
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
}