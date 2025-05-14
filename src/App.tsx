import './App.css'
import AppRoutes from './components/AppRoutes';
import Navbar from './components/Navbar/Navbar';

function App() {

	return (
		<div className='appContainer'>
			<Navbar/>
			<AppRoutes/>
		</div>
	)
}

export default App;
