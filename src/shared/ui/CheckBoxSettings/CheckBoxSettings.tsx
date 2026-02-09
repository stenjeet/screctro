import styles from './CheckBoxSettings.module.scss';



interface CheckBoxSettingsProps {
	id: string,
	title: string,
	checked: boolean,
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

 
const CheckBoxSettings: React.FC<CheckBoxSettingsProps> = ({id, title, checked, handleChange}) => {
	return (
		<div className={styles.wrapper}>
			{title}
			<div className={styles.checkbox}>
				<input
					type="checkbox"
					checked={checked}	
					onChange={handleChange}
					className={styles.input}
					id={id}
				/>
				<label htmlFor={id}></label>
			</div>
		</div>
	);
};
 

export default CheckBoxSettings;


