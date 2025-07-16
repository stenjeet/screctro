import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import styles from './GalleryPage.module.scss';

const GallaryPage = () => {
	const [images, setImages] = useState<{name: string, path: string}[]>([]);

	const { t } = useTranslation();


	useEffect(() => {
  		const loadImages = async () => {
    	const files = await window.electronAPI.getScreenshotFiles();
    	setImages(files);
  		};
  		loadImages();
	});

	const openImage = (path: string) => {
		window.electronAPI.openScreenshot(path)
	};


	return (
		<div className={styles.GalleryPage}>
			<h1 className={styles.title}>{t ('Gallery')}</h1>
			<div className={styles.PageContent}>
				{images.map((image) => (
					<img
						className={styles.img}
						src={`file://${image.path}`}
						alt={image.name}
						onClick={() => openImage(image.path)}
					/>
				))}
			</div>
		</div>
	);
}
 
export default GallaryPage;