import { useEffect } from 'react';
import './App.css'
import AppRoutes from './components/AppRoutes';
import Navbar from './components/Navbar/Navbar';

function App() {

	useEffect(() => {
		window.electronAPI.onScreenshot(async() => {
			try {
				const sources = await window.electronAPI.getScreenSources();
				if (!sources.length) throw new Error('Не удалось получить источники экрана');

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
		
				if (!ctx) throw new Error('Не удалось получить контекст canvas');

				const img = new Image();
				img.src = sources[0].thumbnail.toDataURL();

				await new Promise((resolve) => {
					img.onload = resolve;
				});

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				const base64 = canvas.toDataURL('image/png');
				await window.electronAPI.saveScreenshot(base64);
			} catch (error: unknown) {
				console.error('Ошибка при создании скриншота:', error);
				alert('Не удалось создать скриншот: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
			}
		})
	}, [])

	return (
		<div className='appContainer'>
			<Navbar/>
			<AppRoutes/>
		</div>
	)
}

export default App;
