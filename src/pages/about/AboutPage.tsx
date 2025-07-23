import { useTranslation } from 'react-i18next';

import Version from '../../shared/ui/Version/Version';

import styles from './AboutPage.module.scss';



const AboutPage = () => {

	const { t } = useTranslation();

	return (
		<div className={styles.AboutPage}>
			<h1 className={styles.title}>{t ('About')}</h1>
			<div className={styles.PageContent}>
				<h4 className={styles.appName}>Screctro</h4>
				<p>{t ('Version')}{' '}<Version /></p>
				<p>{t ("This screenshot tool is built with Electron for quick and convenient screen capturing. Simple interface, minimal settings — maximum efficiency.")}</p>
				<a href="#" className={styles.github}>{t ('Visit')}{' '}GitHub</a>
				<div className={styles.license}>
					<p>{t ('License:')}</p>
				</div>
				<div className={styles.author}>
					<p>Developed by stenjeet</p>
					<p className={styles.allRight}>{t ('All rights reserved')}{' '}© 2025</p>
				</div>
			</div>
		</div>
	);
};


export default AboutPage;