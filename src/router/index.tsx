import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import GallaryPage from "../pages/gallary/GallaryPage";
import ScreenshotPage from "../pages/screenshots/ScreenshotPage";
import SettingsPage from "../pages/settings/SettingsPage";
import AboutPage from "../pages/about/AboutPage";



interface IRoute {
	path: string;
	element: ReactElement;
}

export enum RouteNames {
	GALLARY = 'gallary',
	SCREENSHOTS = 'screenshots',
	SETTINGS = 'settings',
	ABOUT = 'about',
}

export const routes: IRoute[] = [
	{path: RouteNames.GALLARY, element: <GallaryPage/>},
	{path: RouteNames.SCREENSHOTS, element: <ScreenshotPage/>},
	{path: RouteNames.SETTINGS, element: <SettingsPage/>},
	{path: RouteNames.ABOUT, element: <AboutPage/>},
	{path: '*', element: <Navigate to={RouteNames.GALLARY}/>}
]