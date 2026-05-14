import instance from './instance';

const bookmarkApi = {
	// 즐겨찾기 여부 조회 — params의 userSeq는 axios가 자동으로 ?userSeq=값 형태로 URL에 붙여줌
	getStatus: (boardSeq, userSeq) => instance.get(`/api/boards/${boardSeq}/bookmark`, { params: { userSeq } }),
	// 즐겨찾기 토글 (등록/취소) — params의 userSeq는 axios가 자동으로 ?userSeq=값 형태로 URL에 붙여줌
	toggle: (boardSeq, userSeq) => instance.post(`/api/boards/${boardSeq}/bookmark`, null, { params: { userSeq } }),
};

export default bookmarkApi;
