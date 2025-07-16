import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './SettingsPage.module.scss';

import FolderSelector from '../../shared/ui/FolderSelector/FolderSelector';
import CheckBoxSettings from '../../shared/ui/CheckBoxSettings/CheckBoxSettings';
import LanguageSettings from '../../shared/ui/LanguageSettings/LanguageSettings';
import ThemeSettings from '../../shared/ui/ThemeSettings/ThemeSettings';



const SettingsPage = () => {

	const [AutoStart, setAutoStart] = useState(true);
	const [Notification, setNotification] = useState(true);

	const { t } = useTranslation();


	useEffect(() => {
		window.electronAPI.getAutoStart().then(setAutoStart);
		window.electronAPI.getNotification().then(setNotification);
	}, []);

	async function handleAutoStart(e: React.ChangeEvent<HTMLInputElement>) {
		const checked = e.target.checked;
		setAutoStart(checked);
		await window.electronAPI.setAutoStart(checked);
	};

	async function handleNotification(e: React.ChangeEvent<HTMLInputElement>) {
		const checked = e.target.checked;
		setNotification(checked);
		await window.electronAPI.setNotification(checked);
	};


	return (
		<div className={styles.SettingsPage}>
			<h1 className={styles.title}>{t ('Settings')}</h1>
			<div className={styles.PageContent}>
				<CheckBoxSettings
					title={t ('Launch on system startup')}
					checked={AutoStart}
					handleChange={handleAutoStart}
					id='checkboxOne'
				/>
				<CheckBoxSettings
					title={t ('Enable notification')}
					checked={Notification}
					handleChange={handleNotification}
					id='checkboxTwo'
				/>
				<LanguageSettings/>
				<ThemeSettings/>
				<FolderSelector/>
			</div>
		</div>
	);
};
 

export default SettingsPage;