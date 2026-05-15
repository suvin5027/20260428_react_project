import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import Modal from '../../components/Modal';
import Pagination from '../../components/Pagination';
import { CATEGORY_LABEL, PAGE_SIZE } from '../../constants';
import { MdSearch } from 'react-icons/md';

function AdminBoardList() {
	const [boards, setBoards] = useState([]);
	const [category, setCategory] = useState(''); // 카테고리 필터 ('' = 전체)
	const [keyword, setKeyword] = useState('');
	const [searchType, setSearchType] = useState('title'); // title / content / author
	const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 boardSeq (Modal용)
	const [currentPage, setCurrentPage] = useState(1);

	// category 바뀔 때마다 1페이지로 초기화 후 재조회
	useEffect(() => {
		setCurrentPage(1);
		fetchBoards();
	}, [category]);

	// category + keyword + searchType 기준으로 게시글 목록 조회
	const fetchBoards = async () => {
		try {
			const res = await adminApi.getBoards({ category, keyword, searchType });
			setBoards(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 검색 버튼 클릭 또는 Enter → 1페이지로 초기화 후 재조회
	const handleSearch = () => {
		setCurrentPage(1);
		fetchBoards();
	};

	// 게시글 삭제 후 목록 갱신
	const handleDelete = async () => {
		await adminApi.deleteBoard(deleteTarget);
		setDeleteTarget(null);
		fetchBoards();
	};

	// 현재 페이지에 해당하는 목록만 슬라이스
	const totalPages = Math.ceil(boards.length / PAGE_SIZE);
	const currentList = boards.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="admin_section">
			<h3 className="admin_section_title">
				<span>게시판 관리</span>
				<span className="admin_total">총 {boards.length}건</span>
			</h3>

			{/* 카테고리 탭 필터 — 선택된 category와 일치하면 _active */}
			<section className="tab_wrap">
				<ul className="tab_list" role="tablist">
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${category === "" ? " _active" : ""}`} onClick={() => setCategory("")}>전체</button>
					</li>
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${category === "notice" ? " _active" : ""}`} onClick={() => setCategory("notice")}>공지</button>
					</li>
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${category === "general" ? " _active" : ""}`} onClick={() => setCategory("general")}>일반</button>
					</li>
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${category === "question" ? " _active" : ""}`} onClick={() => setCategory("question")}>질문</button>
					</li>
				</ul>
			</section>

			{/* 검색 — 검색 유형 선택(제목/내용/작성자) + 키워드 입력 */}
			<section className="search_wrap search_left_wrap">
				<div className="search_form_group">
					<select
						className="search_select"
						value={searchType}
						onChange={(e) => setSearchType(e.target.value)}
					>
						<option value="title">제목</option>
						<option value="content">내용</option>
						<option value="author">작성자</option>
					</select>
					<input
						type="search"
						name="search"
						id="boardSearch"
						className="search_input"
						value={keyword}
						onChange={(e) => setKeyword(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
					/>
					<button type="button" className="btn btn_search" onClick={handleSearch}>
						<MdSearch />
					</button>
				</div>
			</section>

			<table className="table admin_table">
				<caption>게시판 관리 테이블</caption>
				<colgroup>
					<col style={{width: '55px'}} />
					<col style={{width: '75px'}} />
					<col />
					<col style={{width: '90px'}} />
					<col style={{width: '60px'}} />
					<col style={{width: '60px'}} />
					<col style={{width: '60px'}} />
					<col style={{width: '130px'}} />
					<col style={{width: '70px'}} />
				</colgroup>
				<thead>
					<tr>
						<th scope="col">번호</th>
						<th scope="col">카테고리</th>
						<th scope="col">제목</th>
						<th scope="col">작성자</th>
						<th scope="col">조회수</th>
						<th scope="col">좋아요</th>
						<th scope="col">댓글</th>
						<th scope="col">등록일</th>
						<th scope="col">관리</th>
					</tr>
				</thead>
				<tbody>
					{currentList.length === 0 ? (
						<tr>
							<td colSpan="9" className="admin_empty">검색 결과가 없습니다.</td>
						</tr>
					) : (
						currentList.map((item) => (
							<tr key={item.boardSeq}>
								<td>{item.boardSeq}</td>
								<td>{CATEGORY_LABEL[item.category] ?? item.category}</td>
								<td className="text_left">
									<Link to={`/board/${item.boardSeq}`}>{item.title}</Link>
								</td>
								<td>{item.author}</td>
								<td className="text_right">{item.viewCount.toLocaleString()}</td>
								<td className="text_right">{item.likeCount.toLocaleString()}</td>
								<td className="text_right">{item.commentCount.toLocaleString()}</td>
								<td>{item.createdAt}</td>
								<td>
									<button type="button" className="btn btn_del" onClick={() => setDeleteTarget(item.boardSeq)}>삭제</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{totalPages > 1 && (
				<div className="admin_list_bottom">
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</div>
			)}

			{deleteTarget && (
				<Modal
					message="게시글을 삭제하시겠습니까?"
					onConfirm={handleDelete}
					onCancel={() => setDeleteTarget(null)}
				/>
			)}
		</div>
	);
}

export default AdminBoardList;
