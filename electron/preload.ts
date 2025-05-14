import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
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

  // You can expose other APTs you need here.
  // ...
});

// Экспортируем API для работы со скриншотами
contextBridge.exposeInMainWorld('electronAPI', {
	onScreenshot: (callback: () => void) => {
	ipcRenderer.on('take-screenshot', callback)
	},
	saveScreenshot: (base64: string) => ipcRenderer.invoke('save-screenshot', base64),
	getScreenSources: () => ipcRenderer.invoke('get-screen-sources'),
})
  