import { useContext, useEffect } from 'react';
import './styles/App.scss'
import AppRoutes from '../components/AppRoutes';
import Navbar from '../components/Navbar/Navbar';
import { useLocation } from 'react-router-dom';
import Overlay from '../components/Overlay';
import { ThemeContext } from '../theme/ThemeContext';

function App() {

	const { theme } = useContext(ThemeContext)

	useEffect(() => {
		window.electronAPI.onScreenshot(async() => {
			try {
				const source = await window.electronAPI.getScreenSource();

				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
		
				if (!ctx) throw new Error('Не удалось получить контекст canvas');

				const img = new Image();
				img.src = source.thumbnail.toDataURL();

				await new Promise(resolve => (img.onload = resolve));

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
	}, []);

	const location = useLocation();

	if (location.pathname === '/overlay') {
    	return <Overlay />
  	};

	return (
		<div className={`appContainer ${theme}`}>
			<Navbar/>
			<AppRoutes/>
		</div>
	);
};


export default App;
