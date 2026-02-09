import { ipcMain } from "electron";
import { setSelectionArea } from '../services/overlayService';



export function registerOverlayIPC() {
	ipcMain.handle('set-selection-area', async (_, area) => setSelectionArea(area));
}