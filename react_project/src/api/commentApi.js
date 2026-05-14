import instance from './instance';

const commentApi = {
	getList: (boardSeq) => instance.get(`/api/boards/${boardSeq}/comments`),
	insert: (boardSeq, dto) => instance.post(`/api/boards/${boardSeq}/comments`, dto),
	update: (boardSeq, commentSeq, dto) => instance.put(`/api/boards/${boardSeq}/comments/${commentSeq}`, dto),
	delete: (boardSeq, commentSeq, deletedBy) => instance.delete(`/api/boards/${boardSeq}/comments/${commentSeq}`, { params: { deletedBy } }),
};

export default commentApi;
