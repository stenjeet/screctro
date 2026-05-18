import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RouteNames } from "../../router";

import styles from './Navbar.module.scss';
import Version from "../../shared/ui/Version/Version";
 
const Navbar = () => {

	const { t } = useTranslation();

	return (
		<div className={styles.Navbar}>
			<h3 className={styles.appName}>Screctro</h3>
			<div className={styles.navLinks}>
				<NavLink to={RouteNames.GALLERY} className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>{t ('Gallery')}</NavLink>
				<NavLink to={RouteNames.SETTINGS} className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>{t ('Settings')}</NavLink>
				<NavLink to={RouteNames.ABOUT} className={({ isActive }) => `${styles.link} ${isActive ? styles.activeLink : ''}`}>{t ('About')}</NavLink>
			</div>
			<div className={styles.version}>
				<p><Version/></p>
			</div>
		</div>
	);
};

 
export default Navbar;