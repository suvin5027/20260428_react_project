import instance from './instance';

const authApi = {
	login: (data) => instance.post('/auth/login', data),
	logout: () => instance.post('/auth/logout'),
};

export default authApi;
