import { useContext } from 'react';
import styles from './ThemeSettings.module.scss';
import { Theme, ThemeContext } from '../../../theme/ThemeContext';
import { useTranslation } from 'react-i18next';


 
const ThemeSettings = () => {
	const { theme, changeTheme } = useContext(ThemeContext);
	const { t } = useTranslation();


	return (
		<div className={styles.wrapper}>
			<p>{t ('Theme')}</p>
			<div className={styles.glassRadioGroup}>
				<input
					type="radio" 
					name="theme" 
					className={styles.light} 
					id='Light'
					checked={theme == Theme.LIGHT}
					onChange={() => changeTheme(Theme.LIGHT)}
				/>
				<label htmlFor="Light">{t ('Light')}</label>

				<input 
					type="radio" 
					name="theme" 
					className={styles.dark} 
					id='Dark'
					checked={theme == Theme.DARK}
					onChange={() => changeTheme(Theme.DARK)}
				/>
				<label htmlFor="Dark">{t ('Dark')}</label>

				<div className={styles.glassGlider}></div>
			</div>
		</div>
	);
};


export default ThemeSettings;