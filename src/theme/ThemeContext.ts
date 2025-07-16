import { createContext } from "react";



export enum Theme {
	LIGHT = 'light',
	DARK = 'dark'
};


export interface ThemeContextProps {
	theme?: Theme,
	changeTheme: (theme: Theme) => void
};


const noop = () => {};


export const ThemeContext = createContext<ThemeContextProps>({
  theme: Theme.DARK,   
  changeTheme: noop,   
});
 