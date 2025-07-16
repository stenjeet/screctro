import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { IpcRendererEvent } from 'electron';

import App from './app/App.tsx';
import ThemeProvider from './theme/ThemeProvider.tsx';
import '..//i18n.ts';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
	<HashRouter>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</HashRouter>
  </React.StrictMode>
);


window.ipcRenderer.on('main-process-message', (_event: IpcRendererEvent, ...args: unknown[]) => {
  const message = args[0] as string;
  console.log(message);
});
