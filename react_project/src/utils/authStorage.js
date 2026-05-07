const CURRENT_KEY = 'auth_user';

// 현재 로그인한 사용자 반환 (없으면 null)
export function getCurrentUser() {
	const data = localStorage.getItem(CURRENT_KEY);
	return data ? JSON.parse(data) : null;
}

// 로그인 여부
export function isLoggedIn() {
	return !!getCurrentUser();
}

// 관리자 여부 (userRole이 'ADMIN'인 사용자)
export function isAdmin() {
	const user = getCurrentUser();
	return user?.userRole === 'ADMIN';
}

// 로그인 성공 시 사용자 정보 저장
export function setCurrentUser(user) {
	localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
	window.dispatchEvent(new Event('authChange'));
}

// 로그아웃
export function logout() {
	localStorage.removeItem(CURRENT_KEY);
	window.dispatchEvent(new Event('authChange'));
}
