import { ReactNode, useEffect, useState } from "react";
import { Theme, ThemeContext } from "./ThemeContext";



function isTheme(value: string): value is Theme {
	return value === Theme.LIGHT || value === Theme.DARK;
};

 
const ThemeProvider = ({children}: {children: ReactNode}) => {
	const [theme, setTheme] = useState<Theme>(Theme.DARK);


	useEffect(() => {
    	window.electronAPI.getTheme().then((savedTheme: string) => {
      		if (isTheme(savedTheme)) {
        		setTheme(savedTheme);
      		} else {
        		setTheme(Theme.LIGHT);
      		};
    	});
  	}, []);


	function changeTheme(newTheme: Theme): void {
		setTheme(newTheme);
		window.electronAPI.setTheme(newTheme);
	};


	return (
		<ThemeContext.Provider value={{
			theme,
			changeTheme,
		}}>
			{children}
		</ThemeContext.Provider>
	);
};


export default ThemeProvider;