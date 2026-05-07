// 외부 라이브러리
import { useState } from 'react';
import { Link } from 'react-router-dom';

// 유틸/상수
import { PAGE_SIZE, CATEGORY_LABEL } from '../../constants';
import { getPosts } from '../../utils/boardStorage';

// 내부 컴포넌트
import Pagination from '../../components/Pagination';

function BoardList() {
	// localStorage에서 목록 초기 로드 후 공지 상단 고정 + 최신순 정렬
	const [posts, setPosts] = useState(() =>
		[...getPosts()].sort((a, b) => {
			if (a.category === 'notice' && b.category !== 'notice') return -1;
			if (a.category !== 'notice' && b.category === 'notice') return 1;
			return b.date.localeCompare(a.date);
		})
	);
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(posts.length / PAGE_SIZE);

	// 현재 페이지에 맞게 잘라내기
	const currentList = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="board_container board_list_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">게시판</h3>
				<Link to="/board/write" className="btn btn_add">글쓰기</Link>
			</div>

			{/* 게시판 리스트 */}
			<ul className="board_wrap">
				{currentList.map((item) => (
					<li key={item.id} className='board_item'>
						<Link to={`/board/${item.id}`} className='board_link' title={item.title}>
							<span className={`board_info__label _${item.category}`}>{CATEGORY_LABEL[item.category]}</span>
							<span className='board_info__title'>{item.title}</span>
							<div className='board_info'>
								<span className='board_info__date'>{item.date}</span>
							</div>
						</Link>
					</li>
				))}
			</ul>

			{/* 페이지네이션 */}
			<div className="board_ft_wrap">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
}

export default BoardList;
