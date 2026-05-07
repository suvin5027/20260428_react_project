// 페이지당 게시글 수
export const PAGE_SIZE = 15;

// 로컬스토리지 키
export const STORAGE_KEY = {
	TOKEN: 'token',
	USER: 'user',
};

// API 엔드포인트
export const API_ENDPOINT = {
	BOARD: '/board',
	AUTH: '/auth',
};

// 게시글 카테고리 — DB 코드값(key)과 화면 표시 텍스트(value) 매핑
// ※ DB에서 오는 코드값이 바뀌면 key만 수정하면 됨
// 예) DB가 'N', 'G', 'Q'로 준다면 → { N: '공지사항', G: '일반글', Q: '질문글' }
// 예) DB가 'NOTICE', 'GENERAL'로 준다면 → { NOTICE: '공지사항', GENERAL: '일반글' }
export const CATEGORY_LABEL = {
	notice: '공지사항',
	general: '일반글',
	question: '질문글',
};

// 게시글 카테고리 select 옵션 목록
// ※ 카테고리 추가/제거 시 여기만 수정하면 모든 select에 자동 반영됨
export const CATEGORY_OPTIONS = [
	{ value: 'notice', label: '공지사항' },
	{ value: 'general', label: '일반글' },
	{ value: 'question', label: '질문글' },
];
