import { useEffect, useState } from "react";
import styles from './GalleryPage.module.scss';

const GallaryPage = () => {

	const [images, setImages] = useState<{name: string, path: string}[]>([]);

	useEffect(() => {
		const loadImages = async() => {
			const files = await window.electronAPI.getScreenshotFiles();
			setImages(files);
		};
		loadImages();
	});

	return (
		<div>
			<h2>Галерея</h2>
			<div className={styles.PageContent}>
				{images.map((image) => (
					<img
						src={`file://${image.path}`}
						alt={image.name}
						style={{width: 250}}
					/>
				))}
			</div>
		</div>
	);
}
 
export default GallaryPage;