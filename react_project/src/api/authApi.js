import instance from './instance';

const authApi = {
	login: (data) => instance.post('/api/user/login', data),
	register: (data) => instance.post('/api/user/register', data),
};

export default authApi;
