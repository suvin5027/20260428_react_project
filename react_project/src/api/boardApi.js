import instance from './instance';

const boardApi = {
	getList: (params) => instance.get('/boards', { params }),
	getDetail: (id) => instance.get(`/boards/${id}`),
	create: (data) => instance.post('/boards', data),
	update: (id, data) => instance.put(`/boards/${id}`, data),
	delete: (id) => instance.delete(`/boards/${id}`),
};

export default boardApi;
