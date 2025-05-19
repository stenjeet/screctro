import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import GalleryPage from "../pages/gallery/GalleryPage";
import SettingsPage from "../pages/settings/SettingsPage";
import AboutPage from "../pages/about/AboutPage";



interface IRoute {
	path: string;
	element: ReactElement;
}

export enum RouteNames {
	GALLARY = 'gallary',
	SETTINGS = 'settings',
	ABOUT = 'about',
}

export const routes: IRoute[] = [
	{path: RouteNames.GALLARY, element: <GalleryPage/>},
	{path: RouteNames.SETTINGS, element: <SettingsPage/>},
	{path: RouteNames.ABOUT, element: <AboutPage/>},
	{path: '*', element: <Navigate to={RouteNames.GALLARY}/>}
]