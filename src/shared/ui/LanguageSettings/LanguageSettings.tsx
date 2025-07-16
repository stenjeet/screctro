import { useTranslation } from 'react-i18next';
import styles from './LanguageSettings.module.scss';
import { useEffect, useState } from 'react';



const LanguageSettings = () => {
	const [lang, setLang] = useState<string | undefined>(undefined);

	const {i18n, t} = useTranslation();


	useEffect(() => {
    	window.electronAPI.getLang().then(lang => setLang(lang));
  	}, []);

	useEffect(() => {
  		window.electronAPI.getLang().then((savedLang) => {
    	setLang(savedLang);
    	i18n.changeLanguage(savedLang);
  	});
	}, []);


	const onChangeLang = (newLang: string) => {
  		setLang(newLang);
  		i18n.changeLanguage(newLang);
  		window.electronAPI.setLang(newLang); 
	};


	return (
		<div className={styles.wrapper}>
			<p>{t('Interface language')}</p>
			<div className={styles.glassRadioGroup}>
  				<input
					type="radio" 
					name="language" 
					className={styles.Russian} 
					id='Russian' 
					checked={lang === 'ru'}
					onChange={() => onChangeLang('ru')}
				/>
  				<label htmlFor="Russian">{t ('Russian')}</label>

  				<input 
					type="radio" 
					name="language" 
					className={styles.English} 
					id='English'
					checked={lang === 'en'}
					onChange={() => onChangeLang('en')}
				/>
  				<label htmlFor="English">{t ('English')}</label>

  				<div className={styles.glassGlider}></div>
			</div>
		</div>
	);
};
 

export default LanguageSettings;