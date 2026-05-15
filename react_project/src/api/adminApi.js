import instance from './instance';

const adminApi = {
	// 유저 목록 조회 (keyword 검색)
	getUsers: (params) => instance.get('/api/admin/users', { params }),
	// 역할 변경
	updateUserRole: (userSeq, userRole) => instance.put(`/api/admin/users/${userSeq}/role`, { userRole }),
	// 유저 삭제
	deleteUser: (userSeq) => instance.delete(`/api/admin/users/${userSeq}`),
	// 게시글 목록 조회 (category 필터)
	getBoards: (params) => instance.get('/api/admin/boards', { params }),
	// 게시글 삭제
	deleteBoard: (boardSeq) => instance.delete(`/api/admin/boards/${boardSeq}`),
};

export default adminApi;
