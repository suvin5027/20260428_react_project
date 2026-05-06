const USERS_KEY   = 'auth_users';
const CURRENT_KEY = 'auth_user';

// localStorage에서 전체 회원 목록 조회
function getUsers() {
	const data = localStorage.getItem(USERS_KEY);
	return data ? JSON.parse(data) : [];
}

// 현재 로그인한 사용자 반환 (없으면 null)
export function getCurrentUser() {
	const data = localStorage.getItem(CURRENT_KEY);
	return data ? JSON.parse(data) : null;
}

// 로그인 여부
export function isLoggedIn() {
	return !!getCurrentUser();
}

// 관리자 여부 (id가 'admin'인 사용자)
export function isAdmin() {
	const user = getCurrentUser();
	return user?.id === 'admin';
}

// 회원가입
// 성공: { success: true }
// 실패: { success: false, field: '문제 필드명', message: '에러 메시지' }
export function register({ name, id, email, password }) {
	const users = getUsers();

	// 아이디 중복 체크
	if (users.find((u) => u.id === id)) {
		return { success: false, field: 'id', message: '이미 사용 중인 아이디입니다.' };
	}
	// 이메일 중복 체크
	if (users.find((u) => u.email === email)) {
		return { success: false, field: 'email', message: '이미 사용 중인 이메일입니다.' };
	}

	// uid: 시스템 고유번호(자동생성), id: 사용자가 입력한 아이디
	const newUser = { uid: Date.now(), id, name, email, password };
	localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
	return { success: true };
}

// 로그인
// 성공: { success: true, user }
// 실패: { success: false, message: '에러 메시지' }
export function login({ id, password }) {
	const users = getUsers();
	const user = users.find((u) => u.id === id && u.password === password);

	if (!user) {
		return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' };
	}

	// 비밀번호는 로그인 유지 데이터에 저장하지 않음
	const { password: _, ...safeUser } = user;
	localStorage.setItem(CURRENT_KEY, JSON.stringify(safeUser));
	return { success: true, user: safeUser };
}

// 로그아웃
export function logout() {
	localStorage.removeItem(CURRENT_KEY);
}
