import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

import GalleryPage from "../pages/gallery/GalleryPage";
import SettingsPage from "../pages/settings/SettingsPage";
import AboutPage from "../pages/about/AboutPage";
import Overlay from "../components/Overlay";



interface IRoute {
	path: string;
	element: ReactElement;
};

export enum RouteNames {
	GALLERY = 'gallary',
	SETTINGS = 'settings',
	ABOUT = 'about',
	OVERLAY = 'overlay'
};

export const routes: IRoute[] = [
	{path: RouteNames.GALLERY, element: <GalleryPage/>},
	{path: RouteNames.SETTINGS, element: <SettingsPage/>},
	{path: RouteNames.ABOUT, element: <AboutPage/>},
	{path: RouteNames.OVERLAY, element: <Overlay/>},
	{path: '*', element: <Navigate to={RouteNames.GALLERY}/>}
];