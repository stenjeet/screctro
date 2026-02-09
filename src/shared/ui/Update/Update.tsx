import { useTranslation } from 'react-i18next';
import styles from './Update.module.scss';


 
const Update = () => {

	const { t } = useTranslation();

	const checkUpdates = () => {
		window.electronAPI.checkForUpdates();
	};

	return (
		<div className={styles.wrapper}>
			<p>{t ('Check for updates')}</p>
			<button className={styles.btn} onClick={checkUpdates}>{t ('Check')}</button>
		</div>
	);
};

 
export default Update;