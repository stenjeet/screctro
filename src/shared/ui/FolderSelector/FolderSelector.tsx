import { useEffect, useState } from "react";
import styles from './FolderSelector.module.scss';
import { HiOutlineFolder } from "react-icons/hi";
import { useTranslation } from "react-i18next";


 
const FolderSelector = () => {
	const [folderPath, setFolderPath] = useState('');
	const { t } = useTranslation();


	function handleSelectFolder() {
		window.electronAPI.openFolderDialog();
	};

	useEffect(() => {
		window.electronAPI.onSelectedFolder((path) => {
			setFolderPath(path);
		});
	}, []);

	useEffect(() => {
  		window.electronAPI.getScreenshotFolder().then(setFolderPath);

 		window.electronAPI.onSelectedFolder((path) => {
    	setFolderPath(path);
  	});
	}, []);

	return (
		<div className={styles.wrapper}>
			<p>{t ('Screenshot save folder')}</p>
      		<button className={styles.folderBtn} onClick={handleSelectFolder}>
				{folderPath || "Не выбрана"}
				<HiOutlineFolder className={styles.icon}/>
			</button>
		</div>
	);
};
 
export default FolderSelector;