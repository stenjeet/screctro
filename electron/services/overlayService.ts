import { BrowserWindow, desktopCapturer, screen } from "electron";
import path from "path";
import { VITE_DEV_SERVER_URL, RENDERER_DIST, PRELOAD_PATH} from "../paths";
import { saveScreenshot } from "./screenshotService";



let overlay: BrowserWindow | null;

export function overlayWindow() {
	const cursorPoint = screen.getCursorScreenPoint()
	const display = screen.getDisplayNearestPoint(cursorPoint);
	const { bounds } = display;


	overlay = new BrowserWindow({
		x: bounds.x,
		y: bounds.y,
		width: bounds.width,
		height: bounds.height,
		fullscreen: true,
		transparent: true,
		resizable: false,
		alwaysOnTop: false,
		frame: false,
		webPreferences: {
			preload: PRELOAD_PATH,
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true,
			devTools: false,
		}
	});

	if (VITE_DEV_SERVER_URL) {
		overlay.loadURL(`${VITE_DEV_SERVER_URL}#/overlay`)
	} else {
		overlay.loadFile(path.join(RENDERER_DIST, 'index.html'), {
			hash: 'overlay'
		});
	}

	return overlay;
}


export async function setSelectionArea(area: {x: number, y: number, width: number, height: number}) {
	if (overlay) {
		overlay.close();
		overlay = null;
	}

	const cursorPoint = screen.getCursorScreenPoint();
	const display = screen.getDisplayNearestPoint(cursorPoint);

	const sources = await desktopCapturer.getSources({
		types: ['screen'],
		thumbnailSize: display.size,
	});

	const source = sources.find(s => s.display_id === display.id.toString());
	if (!source) throw new Error('Screen source not found');

	const fullImage = source.thumbnail;
	const cropped = fullImage.crop(area);
	const base64 = cropped.toDataURL();
	
	return saveScreenshot(base64);
}