import { NavLink, Outlet } from 'react-router-dom';

function AdminLayout() {
	return (
		<div className="admin_container">
			<aside className="admin_side">
				<h2 className="admin_side_title">시스템 관리</h2>
				<ul className="admin_nav">
					{/* TODO: NavLink to="/admin/users" — 유저 관리 메뉴 (_active 클래스 적용) */}
					<NavLink to={"/admin/users"} className={({ isActive }) => `${isActive ? ' _active' : ''}`}>유저 관리</NavLink>
					{/* TODO: NavLink to="/admin/boards" — 게시판 관리 메뉴 (_active 클래스 적용) */}
					<NavLink to={"/admin/boards"} className={({ isActive }) => `${isActive ? ' _active' : ''}`}>게시판 관리</NavLink>
				</ul>
			</aside>
			<div className="admin_content">
				{/* TODO: <Outlet /> — 자식 라우트(AdminUserList, AdminBoardList) 렌더링 */}
				<Outlet />
			</div>
		</div>
	);
}

export default AdminLayout;
