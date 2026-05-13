import instance from './instance';

const likeApi = {
	getStatus: (boardSeq, userSeq) => instance.get(`/api/boards/${boardSeq}/like`, { params: { userSeq } }),
	toggle: (boardSeq, userSeq) => instance.post(`/api/boards/${boardSeq}/like`, null, { params: { userSeq } }),
};

export default likeApi;
