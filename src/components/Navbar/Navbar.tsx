import { Link } from "react-router-dom";
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
				<Link to={RouteNames.GALLERY} className={styles.link}>{t ('Gallery')}</Link>
				<Link to={RouteNames.SETTINGS} className={styles.link}>{t ('Settings')}</Link>
				<Link to={RouteNames.ABOUT} className={styles.link}>{t ('About')}</Link>
			</div>
			<div className={styles.version}>
				<p><Version/></p>
			</div>
		</div>
	);
};

 
export default Navbar;