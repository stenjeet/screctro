import { Link } from "react-router-dom";
import { RouteNames } from "../../router";

import styles from './Navbar.module.scss';
 
const Navbar = () => {
	return (
		<div className={styles.Navbar}>
			<div className={styles.navLinks}>
				<Link to={RouteNames.GALLARY} className={styles.link}>Галлерея</Link>
				<Link to={RouteNames.SETTINGS} className={styles.link}>Настройки</Link>
				<Link to={RouteNames.ABOUT} className={styles.link}>О приложении</Link>
			</div>
		</div>
	);
}
 
export default Navbar;