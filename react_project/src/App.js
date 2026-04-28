import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Login from './pages/Login';
import BoardList from './pages/board/BoardList';
import BoardDetail from './pages/board/BoardDetail';
import BoardWrite from './pages/board/BoardWrite';
import Admin from './pages/Admin';
import './App.scss';

function App() {
	return (
		<BrowserRouter>
			<div className="wrap">
				<Header />
				<div className="container">
					<Routes>
						<Route path="/" element={<Main />} />
						<Route path="/login" element={<Login />} />
						<Route path="/board" element={<BoardList />} />
						<Route path="/board/write" element={<BoardWrite />} />
						<Route path="/board/:id" element={<BoardDetail />} />
						<Route path="/admin" element={<Admin />} />
					</Routes>
				</div>
				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
