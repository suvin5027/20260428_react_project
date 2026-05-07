import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLoggedIn, logout } from '../utils/authStorage';

function Header() {
	const [loggedIn, setLoggedIn] = useState(isLoggedIn());
	const navigate = useNavigate();

	// 로그인/로그아웃 시 상태 반영
	useEffect(() => {
		const handleAuth = () => setLoggedIn(isLoggedIn());
		window.addEventListener('authChange', handleAuth);
		return () => window.removeEventListener('authChange', handleAuth);
	}, []);

	const handleLogout = () => {
		logout();
		setLoggedIn(false);
		navigate('/login');
	};

	return (
		<header className="header_container">
			<div className="header_logo"><a href="/" className="gnb_link">로고</a></div>
			<nav className="header_menu">
				<ul className="gnb_wrap">
					<li className="gnb_item">
						<a href="/board" className="gnb_link">게시판</a>
					</li>
				</ul>
			</nav>
			<div className="header_info">
				{loggedIn ? (
					<button type="button" className="btn_login" onClick={handleLogout}>로그아웃</button>
				) : (
					<button type="button" className="btn_login" onClick={() => navigate('/login')}>로그인</button>
				)}
			</div>
		</header>
	);
}

export default Header;
