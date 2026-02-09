import { app, Notification, nativeImage, clipboard, screen, desktopCapturer } from "electron";
import Store from "electron-store";
import path from "path";
import * as fs from "node:fs";
import { ICON_PATH } from "../paths";



const store = new Store();


export async function saveScreenshot(base64: string) {

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
		const notification = new Notification({
			title: "Screenshot saved",
			body: `Saved to ${filePath}`,
			icon: ICON_PATH,
		});

		notification.show();
	}

	const img = nativeImage.createFromBuffer(buffer);
	clipboard.writeImage(img);

	return filePath;
}


export async function getScreenSource() {
	const cursorPoint = screen.getCursorScreenPoint();
	const display = screen.getDisplayNearestPoint(cursorPoint);
	const targetDisplayId = display.id.toString();
	
	const sources = await desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: display.size,
	});
		
	const targetSource = sources.find(s => s.display_id === targetDisplayId);
	
	return targetSource;
}

