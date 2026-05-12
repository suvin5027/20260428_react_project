import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/Main';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import FindId from './pages/auth/FindId';
import FindPassword from './pages/auth/FindPassword';
import BoardList from './pages/board/BoardList';
import BoardDetail from './pages/board/BoardDetail';
import BoardWrite from './pages/board/BoardWrite';
import BoardEdit from './pages/board/BoardEdit';
import Admin from './pages/Admin';
import { isLoggedIn } from './utils/authStorage';
import './App.scss';

// 비로그인 시 /login으로 이동
function ProtectedRoute({ children }) {
	return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function App() {
	return (
		<BrowserRouter>
			<div className="wrap">
				<Header />
				<div className="main_container">
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/find-id" element={<FindId />} />
						<Route path="/find-password" element={<FindPassword />} />
						<Route path="/" element={<ProtectedRoute><Main /></ProtectedRoute>} />
						<Route path="/board" element={<ProtectedRoute><BoardList /></ProtectedRoute>} />
						<Route path="/board/write" element={<ProtectedRoute><BoardWrite /></ProtectedRoute>} />
						<Route path="/board/:id" element={<ProtectedRoute><BoardDetail /></ProtectedRoute>} />
						<Route path="/board/:id/edit" element={<ProtectedRoute><BoardEdit /></ProtectedRoute>} />
						<Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
						<Route path="*" element={<ProtectedRoute><Navigate to="/" replace /></ProtectedRoute>} />
					</Routes>
				</div>
				<Footer />
			</div>
		</BrowserRouter>
	);
}

export default App;
