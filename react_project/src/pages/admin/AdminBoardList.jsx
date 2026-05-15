import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../../api/adminApi';
import Modal from '../../components/Modal';
import { CATEGORY_LABEL } from '../../constants';

function AdminBoardList() {
	const [boards, setBoards] = useState([]);
	const [category, setCategory] = useState(''); // 카테고리 필터 ('' = 전체)
	const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 boardSeq (Modal용)

	// category 바뀔 때마다 목록 재조회 (마운트 시 + 탭 클릭 시)
	useEffect(() => {
		fetchBoards();
	}, [category]);

	// category 기준으로 게시글 목록 조회 ('' = 전체)
	const fetchBoards = async () => {
		try {
			const res = await adminApi.getBoards({ category });
			setBoards(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 게시글 삭제 후 목록 갱신
	const handleDelete = async () => {
		await adminApi.deleteBoard(deleteTarget);
		setDeleteTarget(null);
		fetchBoards();
	};

	return (
		<div className="admin_section">
			<h3 className="admin_section_title">게시판 관리</h3>

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

			<table className="table admin_table">
				<caption>게시판 관리 테이블</caption>
				<thead>
					<tr>
						<th scope="col">번호</th>
						<th scope="col">카테고리</th>
						<th scope="col">제목</th>
						<th scope="col">작성자</th>
						<th scope="col">조회수</th>
						<th scope="col">등록일</th>
						<th scope="col">관리</th>
					</tr>
				</thead>
				<tbody>
					{/* boards 배열 순회 — 제목 클릭 시 상세 페이지 이동, 삭제 클릭 시 Modal 오픈 */}
					{boards.map((item) => (
						<tr key={item.boardSeq}>
							<td>{item.boardSeq}</td>
							<td>{CATEGORY_LABEL[item.category] ?? item.category}</td>
							<td>
								<Link to={`/board/${item.boardSeq}`}>{item.title}</Link>
							</td>
							<td>{item.author}</td>
							<td>{item.viewCount}</td>
							<td>{item.createdAt}</td>
							<td>
								<button type="button" className="btn btn_del" onClick={() => setDeleteTarget(item.boardSeq)}>삭제</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* 삭제 확인 모달 — deleteTarget이 있을 때만 렌더링 */}
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
