// 외부 라이브러리
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdSearch, MdAttachFile } from 'react-icons/md';

// API / 상수
import boardApi from '../../api/boardApi';
import { PAGE_SIZE, CATEGORY_LABEL } from '../../constants';

// 내부 컴포넌트
import Pagination from '../../components/Pagination';

function BoardList() {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchType, setSearchType] = useState('title');
	const [searchText, setSearchText] = useState('');
	const [isSearched, setIsSearched] = useState(false);
	const searchInputRef = useRef(null);

	// API 호출 — 검색 파라미터 없으면 전체 목록
	const fetchPosts = async (params = {}) => {
		try {
			const res = await boardApi.getList(params);
			setPosts(res.data);
			setCurrentPage(1);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	// X 버튼 클릭 시에만 전체 목록으로 초기화 (search 이벤트는 X 버튼 클릭 시에만 발생)
	useEffect(() => {
		const el = searchInputRef.current;
		const handleClear = (e) => {
			if (!e.target.value) {
				setIsSearched(false);
				fetchPosts();
			}
		};
		el.addEventListener('search', handleClear);
		return () => el.removeEventListener('search', handleClear);
	}, []);

	// 검색 실행
	const handleSearch = () => {
		if (!searchText.trim()) {
			setIsSearched(false);
			fetchPosts();
		} else {
			setIsSearched(true);
			fetchPosts({ searchType, keyword: searchText });
		}
	};

	const totalPages = Math.ceil(posts.length / PAGE_SIZE);
	const currentList = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="board_container board_list_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">게시판</h3>
				<Link to="/board/write" className="btn btn_add">글쓰기</Link>
			</div>

			{/* 검색 영역 */}
			<section className="search_wrap">
				<select id="searchSelect" className="search_select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
					<option value="title">제목</option>
					<option value="content">내용</option>
					<option value="author">작성자</option>
				</select>
				<div className="search_form_group">
					<input
						type="search"
						name="search"
						id="boardSearch"
						className="search_input"
						ref={searchInputRef}
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button type="button" className="btn btn_search" onClick={handleSearch}>
						<MdSearch />
					</button>
				</div>
			</section>

			{/* 게시판 리스트 */}
			{posts.length === 0 ? (
				<p className="board_empty">
					{isSearched ? '검색 결과가 없습니다.' : '현재 게시된 글이 없습니다.'}
				</p>
			) : (
				<ul className="board_wrap">
					{currentList.map((item) => (
						<li key={item.boardSeq} className='board_item'>
							<Link to={`/board/${item.boardSeq}`} className='board_link' title={item.title}>
								<span className={`board_info__label _${item.category}`}>{CATEGORY_LABEL[item.category]}</span>
								<span className='board_info__title'>
									{item.hasAttachment === 1 && <MdAttachFile className="icon_attach" />}
									<span>{item.title}</span>
								</span>
								<div className='board_info'>
									<span className='board_info__date'>{item.createdAt}</span>
								</div>
							</Link>
						</li>
					))}
				</ul>
			)}

			{/* 페이지네이션 — 게시글 없으면 숨김 */}
			{posts.length > 0 && (
				<div className="board_ft_wrap">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</div>
	);
}

export default BoardList;
