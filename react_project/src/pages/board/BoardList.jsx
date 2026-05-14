// 외부 라이브러리
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// TODO: 댓글 수 아이콘 import 추가 — MdChatBubbleOutline (react-icons/md)
import { MdSearch, MdAttachFile, MdLock, MdVisibilityOff, MdVisibility, MdFavorite, MdChatBubbleOutline } from 'react-icons/md';

// API / 상수
import boardApi from '../../api/boardApi';
import { PAGE_SIZE, CATEGORY_LABEL } from '../../constants';
import { useIsMobile } from '../../hooks/useIsMobile';
import { isAdmin, getCurrentUser } from '../../utils/authStorage';
import { formatViewCount } from '../../utils/format';
import authApi from '../../api/authApi';

// 내부 컴포넌트
import Pagination from '../../components/Pagination';

function BoardList() {
	// navigate: react-router-dom의 페이지 이동 함수 (Link 대신 JS 코드로 이동할 때 사용)
	const navigate = useNavigate();
	// getCurrentUser: localStorage에서 현재 로그인한 유저 정보를 가져오는 유틸 함수
	const user = getCurrentUser();

	// 게시판 목록 관련 state
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchType, setSearchType] = useState('title');
	const [searchText, setSearchText] = useState('');
	const [isSearched, setIsSearched] = useState(false);
	const searchInputRef = useRef(null);

	// 비밀글 모달 관련 state
	const [selectedPost, setSelectedPost] = useState(null); // 클릭한 비밀글 item
	const [passwordInput, setPasswordInput] = useState(''); // 입력한 비밀번호
	const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지
	const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김

	// 반응형 관련 — 1280px 이하 모바일/태블릿이면 페이지당 10개, 데스크탑이면 15개
	const isMobile = useIsMobile();
	const pageSize = isMobile ? 10 : PAGE_SIZE;





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

	// 비밀글 클릭 — 관리자는 바로 이동, 본인은 모달, 그 외는 차단
	const handleSecretClick = (item) => {
		if (isAdmin()) {
			navigate(`/board/${item.boardSeq}`);
		} else if (item.userSeq === user?.userSeq) {
			setSelectedPost(item);
		} else {
			alert('열람 권한이 없습니다.');
		}
	};

	// 비밀번호 검증 — 성공 시 게시글로 이동, 실패 시 에러 메시지 표시
	const handleVerifyPassword = async () => {
		try{
			await authApi.verifyPassword({ userId: user.userId, password: passwordInput });
			navigate(`/board/${selectedPost.boardSeq}`, { state: { verified: true } });
		} catch {
			setPasswordError("비밀번호가 틀렸습니다.")
		}
	};

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

	const totalPages = Math.ceil(posts.length / pageSize);
	const currentList = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
							{item.category === 'secret' ? (
								<button className='board_link' title={isAdmin() || item.userSeq === user?.userSeq ? item.title : "비밀글 입니다."} onClick={() => handleSecretClick(item)}>
									<div className="board_title_wrap">
										<span className={`board_info__label _${item.category}`}>{CATEGORY_LABEL[item.category]}</span>
										<span className='board_info__title'>
											{/* 비밀글: 자물쇠 아이콘 + 관리자/본인이면 제목, 아니면 "비밀글 입니다." */}
											<>
												{item.hasAttachment === 1 && <MdAttachFile className="icon_attach" />}
												<MdLock />
												<span className="board_info__cont">{isAdmin() || item.userSeq === user?.userSeq ? item.title : '비밀글 입니다.'}</span>
											</>
										</span>
									</div>
									<div className="board_info_wrap">
										<span className='board_info__user'>{item.author}</span>
										<span className='board_info__date'>{item.createdAt}</span>
										<span className='board_info__like'><MdFavorite /> {formatViewCount(item.likeCount ?? 0)}</span>
										{/* TODO: 댓글 수 표시 — Spring BoardMapper에서 commentCount 필드 추가 필요
												<span className='board_info__comment'><MdChatBubbleOutline /> {item.commentCount ?? 0}</span> */}
										<span className='board_info__comment'><MdChatBubbleOutline /> {item.commentCount ?? 0}</span>
										<span className='board_info__view'>조회 {formatViewCount(item.viewCount)}</span>
									</div>
								</button>
							) : (
								<Link to={`/board/${item.boardSeq}`} className='board_link' title={item.title}>
									<div className="board_title_wrap">
										{/* 좋아요 10개 이상 + 공지/비밀 제외 시 _popular 클래스로 배경 노란색 */}
										<span className={`board_info__label _${item.category}${item.likeCount >= 10 && item.category !== 'notice' ? ' _popular' : ''}`}>{CATEGORY_LABEL[item.category]}</span>
										<span className='board_info__title'>
											{/* 비밀글: 자물쇠 아이콘 + 관리자면 제목, 아니면 "비밀글 입니다." */}
											{item.category === 'secret' ? (
												<>
													{item.hasAttachment === 1 && <MdAttachFile className="icon_attach" />}
													<MdLock />
													<span className="board_info__cont">{isAdmin() ? item.title : '비밀글 입니다.'}</span>
												</>
											) : (
												<>
													{item.hasAttachment === 1 && <MdAttachFile className="icon_attach" />}
													<span className="board_info__cont">{item.title}</span>
												</>
											)}
										</span>
									</div>
									<div className="board_info_wrap">
										<span className='board_info__user'>{item.author}</span>
										<span className='board_info__date'>{item.createdAt}</span>
										<span className='board_info__like'><MdFavorite /> {formatViewCount(item.likeCount ?? 0)}</span>
										{/* TODO: 댓글 수 표시 — Spring BoardMapper에서 commentCount 필드 추가 필요
												<span className='board_info__comment'><MdChatBubbleOutline /> {item.commentCount ?? 0}</span> */}
										<span className='board_info__comment'><MdChatBubbleOutline /> {item.commentCount ?? 0}</span>
										<span className='board_info__view'>조회 {formatViewCount(item.viewCount)}</span>
									</div>
								</Link>
							)}
						</li>
					))}
				</ul>
			)}

			{/* 비밀번호 모달 — 비밀글 클릭 시 표시 */}
			{selectedPost && (
				<div className="popup_overlay">
					<div className="popup_box">
						<h6>비밀번호를 입력하세요.</h6>
						{/* 비밀번호 input + 눈 아이콘 토글 */}
						<div className="input_form_group">
							<input
								type={showPassword ? 'text' : 'password'}
								name="modalInput"
								id="modalInput"
								className="input_password"
								autoComplete="new-password"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()}
							/>
							<button type="button" className="btn_visible" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <MdVisibilityOff /> : <MdVisibility /> }
							</button>
						</div>
						{passwordError && <p className="form_error">{passwordError}</p>}
						<div className="popup_box_ft">
							<button type="button" className="btn btn_add" onClick={handleVerifyPassword}>확인</button>
							<button type="button" className="btn btn_cancel" onClick={() => { setSelectedPost(null); setPasswordInput(''); setPasswordError(''); setShowPassword(false); }}>취소</button>
						</div>
					</div>
				</div>
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
