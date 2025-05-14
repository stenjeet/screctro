import { Route, Routes } from "react-router-dom";
import { routes } from "../router";


const AppRoutes = () => {
	return (
			<Routes>
				{routes.map(item =>
					<Route path={item.path} element={item.element} key={item.path}/>
				)}
			</Routes>
	);
}
 
export default AppRoutes;