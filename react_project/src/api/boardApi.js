import instance from './instance';

const boardApi = {
	getList: (params) => instance.get('/api/boards', { params }),
	getDetail: (id) => instance.get(`/api/boards/${id}`),
	create: (data) => instance.post('/api/boards', data),
	update: (id, data) => instance.put(`/api/boards/${id}`, data),
	delete: (id) => instance.delete(`/api/boards/${id}`),
	incrementViewCount: (id) => instance.put(`/api/boards/${id}/view`),
};

export default boardApi;
