import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { MdPerson, MdAdminPanelSettings } from 'react-icons/md';
import { isLoggedIn, logout, getCurrentUser, getLoginTime, getExpireTime } from '../utils/authStorage';
import { formatLoginTime } from '../utils/format';

// 만료까지 남은 분 계산
function calcRemaining(expireTime) {
	if (!expireTime) return null;
	return Math.max(0, Math.ceil((expireTime - Date.now()) / 60000));
}

function Header() {
	const [loggedIn, setLoggedIn] = useState(isLoggedIn());
	const [user, setUser] = useState(getCurrentUser());
	const [loginTime, setLoginTime] = useState(getLoginTime());
	const [expireTime, setExpireTime] = useState(getExpireTime());
	const [remaining, setRemaining] = useState(() => calcRemaining(getExpireTime()));
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const popupRef = useRef(null);

	// 로그인/로그아웃 시 상태 반영
	useEffect(() => {
		const handleAuth = () => {
			const expire = getExpireTime();
			setLoggedIn(isLoggedIn());
			setUser(getCurrentUser());
			setLoginTime(getLoginTime());
			setExpireTime(expire);
			setRemaining(calcRemaining(expire));
		};
		window.addEventListener('authChange', handleAuth);
		return () => window.removeEventListener('authChange', handleAuth);
	}, []);

	// 1분마다 남은 시간 업데이트
	useEffect(() => {
		if (!loggedIn) return;
		const timer = setInterval(() => {
			setRemaining(calcRemaining(expireTime));
		}, 60000);
		return () => clearInterval(timer);
	}, [loggedIn, expireTime]);

	// 팝업 바깥 클릭 시 닫기
	useEffect(() => {
		const handleOutsideClick = (e) => {
			if (popupRef.current && !popupRef.current.contains(e.target)) {
				setIsPopupOpen(false);
			}
		};
		document.addEventListener('mousedown', handleOutsideClick);
		return () => document.removeEventListener('mousedown', handleOutsideClick);
	}, []);

	if (['/login', '/register'].includes(location.pathname)) return null;

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<header className="header_container">
			<div className="header_logo"><Link to="/" className="logo">로고</Link></div>
			<nav className="header_menu">
				<ul className="gnb_wrap">
					<li className="gnb_item">
						<NavLink to="/board" className={({ isActive }) => `gnb_link${isActive ? ' _active' : ''}`}>게시판</NavLink>
					</li>
					<li className="gnb_item">
						<NavLink to="/board2" className={({ isActive }) => `gnb_link${isActive ? ' _active' : ''}`}>게시판2</NavLink>
					</li>
					{/* 관리자 전용 메뉴 */}
					{(user?.userRole === 'ADMIN' || user?.userRole === 'SUPER') && (
						<li className="gnb_item">
							<NavLink to="/admin" className={({ isActive }) => `gnb_link${isActive ? ' _active' : ''}`}>시스템 관리</NavLink>
						</li>
					)}
				</ul>
			</nav>
			<div className="header_info">
				{loggedIn ? (
					<>
						<div className="header_profile_wrap" ref={popupRef}>
							<button
								type="button"
								className="header_nickname"
								onClick={() => setIsPopupOpen((prev) => !prev)}
							>
								{(user?.userRole === 'ADMIN' || user?.userRole === 'SUPER')
									? <MdAdminPanelSettings className="header_nickname_icon _admin" />
									: <MdPerson className="header_nickname_icon" />
								}
								<span>{user?.nickname}</span>
							</button>

							{isPopupOpen && (
								<div className="header_profile_popup">
									<div className="popup_session_info">
										<span>접속 {formatLoginTime(loginTime)}</span>
										<span className={remaining !== null && remaining <= 30 ? '_warn' : ''}>
											만료 {formatLoginTime(expireTime)}
											{remaining !== null && remaining <= 30 && ` (${remaining}분 후 만료)`}
										</span>
									</div>
									<button type="button" className="btn_profile_edit">프로필 수정</button>
								</div>
							)}
						</div>
						<button type="button" className="btn btn_logout" onClick={handleLogout}>로그아웃</button>
					</>
				) : (
					<button type="button" className="btn btn_login" onClick={() => navigate('/login')}>로그인</button>
				)}
			</div>
		</header>
	);
}

export default Header;
