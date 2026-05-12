import instance from './instance';

const authApi = {
	login: (data) => instance.post('/api/user/login', data),
	register: (data) => instance.post('/api/user/register', data),
	verifyPassword: (data) => instance.post('/api/user/verify-password', data), // 비밀글 열람 시 비밀번호 검증
};

export default authApi;
