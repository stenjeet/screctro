import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HashRouter } from 'react-router-dom'
import { IpcRendererEvent } from 'electron'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
	<HashRouter>
		<App />
	</HashRouter>
  </React.StrictMode>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event: IpcRendererEvent, ...args: unknown[]) => {
  const message = args[0] as string
  console.log(message)
})
