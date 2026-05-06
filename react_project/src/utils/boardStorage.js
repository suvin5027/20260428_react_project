import { formatDate } from './format';

const STORAGE_KEY = 'board_posts';

// 초기 더미 데이터 (localStorage 비어있을 때 seed)
const INITIAL_DATA = [
	{ id: 1, category: 'notice', title: 'AR 원격 협업 이용에 대한 안내 ★', author: '관리자', date: '2025.12.10 14:30', content: 'AR 원격 협업 서비스 이용 시 주의사항을 안내드립니다. 본 서비스는 실시간 화상 연결을 기반으로 하며, 안정적인 네트워크 환경에서 사용하시기 바랍니다. 이용 중 문제가 발생하면 고객센터로 문의해 주세요.' },
	{ id: 2, category: 'notice', title: 'AR 원격 협업 지식블로그 관련 공지', author: '관리자', date: '2025.12.15 14:30', content: '지식블로그 기능이 새롭게 업데이트되었습니다. 팀원들과 노하우를 자유롭게 공유하고, 태그 검색 가이드는 공지 상단 링크를 참고해 주시기 바랍니다.' },
	{ id: 3, category: 'notice', title: '공지사항 내용이 여기에 보여집니다.', author: '관리자', date: '2025.12.12 14:30', content: '공지사항 내용이 이 곳에 표시됩니다. 중요 공지는 반드시 확인 후 업무에 참고하시기 바랍니다.' },
	{ id: 4, category: 'general', title: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes', author: '맹구', date: '2025.12.10 14:30', content: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes, that started with the 1987 Kawasaki Ninja 600R. The original model was released in 1984 and has since grown into a worldwide phenomenon.' },
	{ id: 5, category: 'general', title: 'The Football Is Good For Training And Recreational Purposes.', author: '김철수', date: '2025.12.10 14:30', content: 'The Football Is Good For Training And Recreational Purposes. This product features a durable outer shell and precision-balanced weight distribution for consistent performance on any surface.' },
	{ id: 6, category: 'general', title: 'New range of formal shirts are designed keeping you in mind.', author: '유리', date: '2025.12.09 14:30', content: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart from the crowd. Available in a wide range of colors and sizes to suit every occasion.' },
	{ id: 7, category: 'general', title: 'The beautiful range of Apple Naturale', author: '훈이', date: '2025.12.08 14:30', content: 'The beautiful range of Apple Naturale that has an exciting mix of natural ingredients. With the Goodness of 100% natural ingredients, this range is specially designed to keep you feeling fresh and vibrant all day long.' },
	{ id: 8, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.08 14:30', content: 'Lorem ipsum dolor sit amet consectetur. Viverra amet convallis dolor proin gravida ut nam in. Sed euismod nunc pulvinar nunc sed tempus mauris tincidunt.' },
	{ id: 9, category: 'general', title: '공지사항 내용이 여기에 보여집니다. Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.04 14:30', content: 'Pellentesque nulla varius lacinia lorem blandit facilisi in molestie tincidunt. Nibh sed diam cursus varius amet ultrices ullamcorper ornare.' },
	{ id: 10, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et est provident unde incidunt fugiat nihil consequuntur dicta id molestiae dignissimos.' },
	{ id: 11, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum.' },
];

// 전체 목록 조회 (localStorage 비어있으면 초기 데이터로 seed)
export function getPosts() {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
		return INITIAL_DATA;
	}
	return JSON.parse(data);
}

// 단건 조회 — id는 string으로 오므로 Number()로 변환해서 비교
export function getPost(id) {
	const posts = getPosts();
	return posts.find((p) => p.id === Number(id)) ?? null;
}

// 글쓰기 — id 자동 생성, 날짜 자동 세팅
export function addPost({ category, title, content, author }) {
	const posts = getPosts();
	const newId = posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1;
	const newPost = {
		id: newId,
		category,
		title,
		content,
		author: author ?? '나',
		date: formatDate(new Date().toISOString()),
	};
	// 최신글이 맨 앞에 오도록 unshift 대신 spread 사용
	const updated = [newPost, ...posts];
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	return newPost;
}

// 수정 — 해당 id의 게시글을 찾아서 덮어씀
export function updatePost(id, { category, title, content }) {
	const posts = getPosts();
	const idx = posts.findIndex((p) => p.id === Number(id));
	if (idx === -1) return null;
	posts[idx] = { ...posts[idx], category, title, content };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
	return posts[idx];
}

// 삭제 — 해당 id를 제외한 나머지로 재저장
export function deletePost(id) {
	const posts = getPosts();
	const updated = posts.filter((p) => p.id !== Number(id));
	localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
