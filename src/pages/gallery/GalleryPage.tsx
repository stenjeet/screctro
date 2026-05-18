import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Trash2 } from "lucide-react";
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
	}, []);

	const openImage = (path: string) => {
		window.electronAPI.openScreenshot(path)
	};

	const deleteImage = async (path: string) => {
		await window.electronAPI.deleteScreenshot(path);
		setImages(prev => prev.filter((image) => image.path !== path));
	};


	return (
		<div className={styles.GalleryPage}>
			<div className={styles.PageHeader}>
				<h1 className={styles.title}>{t ('Gallery')}</h1>
				<p className={styles.description}>{t ('All your screenshots in one place.')}</p>
			</div>
			<div className={styles.PageContent}>
				<div className={images.length > 0 ? styles.PageContentGrid : styles.PageContentFlex}>
					{
						images.length > 0
							?
							images.map((image) => (
								<div key={`file://${image.path}`} className={styles.card}>
									<img
										className={styles.img}
										src={`file://${image.path}`}
										alt={image.name}
									/>
									<div className={styles.cardActions}>
										<button className={styles.actionButton} onClick={() => openImage(image.path)}>
											<Eye size={18} />
										</button>
										<button className={`${styles.actionButton} ${styles.trashButton}`} onClick={() => deleteImage(image.path)}>
											<Trash2 size={18} />
										</button>
									</div>
								</div>
							))
							:
							<p className={styles.text}>{t ('It’s empty for now. Take a screenshot and it will appear here.')}</p>
					}
				</div>
			</div>
		</div>
	);
}
 
export default GallaryPage;