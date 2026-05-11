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

// 첨부파일 유효성 규칙
export const FILE_MAX_COUNT = 10; // 게시글당 최대 파일 수
// 크기 참고:
// 5MB = 5 * 1024 * 1024 / 10MB = 10 * 1024 * 1024
// 20MB = 20 * 1024 * 1024 / 50MB = 50 * 1024 * 1024
export const FILE_MAX_SIZE = 10 * 1024 * 1024; // 10MB (바이트 단위)
export const FILE_ALLOWED_TYPES = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'application/pdf',
	'application/msword',                                                      // .doc
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
	'application/vnd.ms-excel',                                                // .xls
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
	'application/vnd.ms-powerpoint',                                           // .ppt
	'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
	'application/zip',
];

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
