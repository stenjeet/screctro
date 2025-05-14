/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
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
      getScreenSources: () => Promise<Electron.DesktopCapturerSource[]>;
    }
  }
}

export {};
