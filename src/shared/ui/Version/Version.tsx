import { useEffect, useState } from "react";



const Version = () => {
	const [version, setVersion] = useState('');

	useEffect(() => {
		if (window.appVersion) {
			setVersion(window.appVersion.version);
		}
	}, []);

	return (
		<span>{version}</span>
	);
};
 

export default Version;
