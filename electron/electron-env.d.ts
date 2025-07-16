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
    	};
    	electronAPI: {
    	onScreenshot: (callback: () => void) => void;
    	saveScreenshot: (base64: string) => Promise<string>;
    	getScreenSource: () => Promise<Electron.DesktopCapturerSource>;
		setSelectionArea: (area: { x: number; y: number; width: number; height: number }) => void;
		getScreenshotFiles: () => Promise<ScreenshotFile[]>;
		openScreenshot: (path: string) => void;

		// screenshot folder store
		openFolderDialog: () => void;
		onSelectedFolder: (callback: (path: string) => void) => void;
		getScreenshotFolder: () => Promise;

		// autoStart store
		getAutoStart: () => Promise<boolean>;
		setAutoStart: (enable: boolean) => void;

		// notification store
		getNotification: () => Promise<boolean>;
		setNotification: (enable: boolean) => void;

		// theme store
      	getTheme: () => Promise<string>;
      	setTheme: (theme: string) => Promise<void>;
		
		// language store
  		getLang: () => Promise<string>;
  		setLang: (lang: string) => Promise<void>;
		};
		appVersion: {
			version: string
		}
	}
}

export {};
