import { useTranslation } from 'react-i18next';

import Version from '../../shared/ui/Version/Version';

import styles from './AboutPage.module.scss';



const AboutPage = () => {

	const { t } = useTranslation();

	return (
		<div className={styles.AboutPage}>
			<h1 className={styles.title}>{t ('About')}</h1>
			<div className={styles.PageContent}>
				<p className={styles.appName}>Application Name</p>
				<p>Version{' '}<Version /></p>
				<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, recusandae officiis possimus vitae aperiam quos blanditiis aliquam nulla cumque tempore iusto rerum perferendis deserunt at?</p>
				<a href="#" className={styles.github}>Visit GitHub</a>
				<div className={styles.license}>
					<p>License:</p>
				</div>
				<div className={styles.author}>
					<p>Developed by stenjeet</p>
					<p className={styles.allRight}>All rights reserved © 2025</p>
				</div>
			</div>
		</div>
	);
};


export default AboutPage;