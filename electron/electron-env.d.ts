/// <reference types="vite-plugin-electron/electron-env" />

interface ScreenshotFile {
	name: string,
	path: string,
}




declare namespace NodeJS {
  interface ProcessEnv {
    APP_ROOT: string
    VITE_PUBLIC: string
  }
}

declare global {
  	interface Window {
    	ipcRenderer: {
      	on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void): void;
      	off(channel: string, listener: (...args: unknown[]) => void): void;
      	send(channel: string, ...args: unknown[]): void;
      	invoke(channel: string, ...args: unknown[]): Promise<unknown>;
    	}
    	electronAPI: {
    	onScreenshot: (callback: () => void) => void;
    	saveScreenshot: (base64: string) => Promise<string>;
    	getScreenSource: () => Promise<Electron.DesktopCapturerSource>;
		// gallery page
		getScreenshotFiles: () => Promise<ScreenshotFile[]>;
		}
	}
}

export {};
