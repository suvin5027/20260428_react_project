const CURRENT_KEY = 'auth_user';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24시간 (ms)

// 현재 로그인한 사용자 반환 (없거나 24시간 경과 시 null)
export function getCurrentUser() {
	const data = localStorage.getItem(CURRENT_KEY);
	if (!data) return null;

	const parsed = JSON.parse(data);

	// 구 형식 (loginTime 없는 flat user 객체) → 새 형식으로 자동 변환
	if (!parsed.loginTime) {
		localStorage.setItem(CURRENT_KEY, JSON.stringify({ user: parsed, loginTime: Date.now() }));
		return parsed;
	}

	if (Date.now() - parsed.loginTime > SESSION_DURATION) {
		logout();
		return null;
	}
	return parsed.user;
}

// 로그인 시각 반환 (timestamp)
export function getLoginTime() {
	const data = localStorage.getItem(CURRENT_KEY);
	if (!data) return null;
	const parsed = JSON.parse(data);
	return parsed.loginTime || null;
}

// 만료 시각 반환 (loginTime + 24시간, timestamp)
export function getExpireTime() {
	const loginTime = getLoginTime();
	return loginTime ? loginTime + SESSION_DURATION : null;
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

// 로그인 성공 시 사용자 정보 저장 (loginTime 포함)
export function setCurrentUser(user) {
	localStorage.setItem(CURRENT_KEY, JSON.stringify({ user, loginTime: Date.now() }));
	window.dispatchEvent(new Event('authChange'));
}

// 로그아웃
export function logout() {
	localStorage.removeItem(CURRENT_KEY);
	window.dispatchEvent(new Event('authChange'));
}
