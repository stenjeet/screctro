import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
});

// Экспортируем API для работы со скриншотами
contextBridge.exposeInMainWorld('electronAPI', {
	onScreenshot: (callback: () => void) => {
		ipcRenderer.on('take-screenshot', callback)
	},
	saveScreenshot: (base64: string) => ipcRenderer.invoke('save-screenshot', base64),
	getScreenSource: () => ipcRenderer.invoke('get-screen-source'),
	getScreenshotFiles: () => ipcRenderer.invoke('get-screenshot-files'),
	// area screenshot
});
  