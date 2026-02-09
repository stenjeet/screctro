import { fileURLToPath } from "node:url";
import path from "node:path";



const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const APP_ROOT = path.join(__dirname, '..');
process.env.APP_ROOT = APP_ROOT;



// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
export const PRELOAD_PATH = path.join(MAIN_DIST, 'preload.mjs');
export const PUBLIC_PATH = path.join(APP_ROOT, 'public');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

export const IS_DEV = !!VITE_DEV_SERVER_URL;

export const ICON_PATH = IS_DEV 
	? path.join(PUBLIC_PATH, 'screenshot_logo.ico')
	: path.join(RENDERER_DIST, 'screenshot_logo.ico');


console.log(MAIN_DIST)