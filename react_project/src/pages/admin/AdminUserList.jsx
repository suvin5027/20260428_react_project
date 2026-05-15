import { useState, useEffect } from 'react';
import adminApi from '../../api/adminApi';
import Pagination from '../../components/Pagination';
import { ROLE_OPTIONS, PAGE_SIZE } from '../../constants';
import { MdSearch } from 'react-icons/md';

function AdminUserList() {
	const [users, setUsers] = useState([]);
	const [keyword, setKeyword] = useState('');
	const [currentPage, setCurrentPage] = useState(1);

	// 마운트 시 전체 유저 목록 로드
	useEffect(() => {
		fetchUsers();
	}, []);

	// keyword 상태 기준으로 유저 목록 조회
	// keyword가 빈 문자열이면 Spring에서 전체 반환, 값이 있으면 아이디/이름/닉네임 필터링
	const fetchUsers = async () => {
		try {
			const res = await adminApi.getUsers({ keyword });
			setUsers(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 검색 버튼 클릭 또는 Enter → 1페이지로 초기화 후 재조회
	const handleSearch = () => {
		setCurrentPage(1);
		fetchUsers();
	};

	// select 변경 시 호출 — 선택한 역할(newRole)을 서버에 바로 저장 후 목록 갱신
	const handleRoleChange = async (userSeq, newRole) => {
		await adminApi.updateUserRole(userSeq, newRole);
		fetchUsers();
	};

	// 현재 페이지에 해당하는 목록만 슬라이스
	const totalPages = Math.ceil(users.length / PAGE_SIZE);
	const currentList = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="admin_section">
			<h3 className="admin_section_title">
				<span>유저 관리</span>
				<span className="admin_total">총 {users.length}건</span>
			</h3>

			{/* 검색 — 아이디 / 이름 / 닉네임 통합 검색 */}
			<section className="search_wrap search_left_wrap">
				<div className="search_form_group">
					<input
						type="search"
						name="search"
						id="userRoleSearch"
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
				<caption>유저 관리 테이블</caption>
				<colgroup>
					<col style={{width: '55px'}} />
				</colgroup>
				<thead>
					<tr>
						<th scope="col">번호</th>
						<th scope="col">아이디</th>
						<th scope="col">이름</th>
						<th scope="col">닉네임</th>
						<th scope="col">이메일</th>
						<th scope="col">권한</th>
						<th scope="col">가입일</th>
						<th scope="col">최근 접속</th>
						<th scope="col">관리</th>
					</tr>
				</thead>
				<tbody>
					{currentList.length === 0 ? (
						<tr>
							<td colSpan="9" className="admin_empty">검색 결과가 없습니다.</td>
						</tr>
					) : (
						currentList.map((user) => (
							<tr key={user.userSeq}>
								<td>{user.userSeq}</td>
								<td>{user.userId}</td>
								<td>{user.userName}</td>
								<td>{user.nickname}</td>
								<td>{user.email}</td>
								<td>{user.userRole}</td>
								<td>{user.createdAt}</td>
								<td>{user.lastLoginAt ?? '-'}</td>
								<td>
									{/* select의 value={user.userRole}로 현재 역할이 선택된 상태로 표시
									    onChange에서 user.userSeq(이 행의 유저)와 선택값(새 역할)을 같이 넘김 */}
									<select className="table_select" value={user.userRole} onChange={(e) => handleRoleChange(user.userSeq, e.target.value)}>
										{ROLE_OPTIONS.map((role) => (
											<option key={role.value} value={role.value}>{role.label}</option>
										))}
									</select>
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
		</div>
	);
}

export default AdminUserList;
