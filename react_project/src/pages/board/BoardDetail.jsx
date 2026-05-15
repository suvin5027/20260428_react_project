import { useState, useEffect, useRef, memo } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from '../../components/Modal';
import ReportModal from '../../components/ReportModal';
// TODO: CommentList import 추가
import CommentList from '../../components/CommentList';
import { CATEGORY_LABEL } from '../../constants';
import boardApi from '../../api/boardApi';
import fileApi from '../../api/fileApi';
import likeApi from '../../api/likeApi';
import bookmarkApi from '../../api/bookmarkApi';
import { MdAttachFile, MdVisibility, MdVisibilityOff, MdFavorite, MdFavoriteBorder, MdStar, MdStarBorder, MdKeyboardArrowUp } from 'react-icons/md';
import { getCurrentUser } from '../../utils/authStorage';
import authApi from '../../api/authApi';

// 본문 — memo로 감싸서 부모 리렌더링 시 innerHTML 재평가 방지 (스크롤 위치 유지)
const PostContent = memo(({ content }) => (
	<div dangerouslySetInnerHTML={{ __html: content }} />
));

function BoardDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const user = getCurrentUser(); // 현재 로그인 유저
	const location = useLocation();
	// StrictMode 개발 환경에서 useEffect가 2번 실행되는 것을 막기 위해 ref로 한 번만 호출
	const viewCountCalled = useRef(false);

	const [post, setPost] = useState(null);
	const [files, setFiles] = useState([]); // 첨부파일 목록
	const [isDeleteModal, setIsDeleteModal] = useState(false);
	const [isReportModal, setIsReportModal] = useState(false);
	const [isBookmarkModal, setIsBookmarkModal] = useState(false);
	// 비밀글 비밀번호 검증 관련 state
	const [isVerified, setIsVerified] = useState(location.state?.verified || false); // 비밀번호 검증 통과 여부 (List에서 넘어온 경우 true)
	const [passwordInput, setPasswordInput] = useState(''); // 입력한 비밀번호
	const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지
	const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김
	const likeBtnRef = useRef(null); // 좋아요 버튼 ref — DOM 직접 조작해 리렌더링 방지
	const bookmarkBtnRef = useRef(null); // 즐겨찾기 버튼 ref — DOM 직접 조작해 리렌더링 방지
	const btnTopRef = useRef(null); // 맨 위로 버튼 ref — DOM 직접 조작해 리렌더링 방지

	// 스크롤 1/5 넘으면 버튼 표시, 3초 가만히 있으면 자동 숨김
	useEffect(() => {
		let ticking = false;
		let hideTimer = null;
		const handleScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const scrollY = window.scrollY;
				const total = document.documentElement.scrollHeight - window.innerHeight;
				const shouldShow = scrollY > total / 5;
				btnTopRef.current?.classList.toggle('_visible', shouldShow);
				btnTopRef.current?.classList.toggle('_at_bottom', scrollY >= total - 50);
				ticking = false;
				clearTimeout(hideTimer);
				if (shouldShow) {
					hideTimer = setTimeout(() => {
						btnTopRef.current?.classList.remove('_visible');
					}, 3000);
				}
			});
		};
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
			clearTimeout(hideTimer);
		};
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

	useEffect(() => {
		const load = async () => {
			// viewCountCalled: React StrictMode는 개발 환경에서 useEffect를 2번 실행한다.
			// ref는 리렌더링과 관계없이 값이 유지되므로, 플래그로 써서 최초 1번만 실행되도록 막는다.
			// 관리자(ADMIN/SUPER)는 조회수 증가 제외
			if (!viewCountCalled.current && user?.userRole !== 'ADMIN' && user?.userRole !== 'SUPER') {
				viewCountCalled.current = true;
				// await로 increment가 DB에 반영될 때까지 기다린다.
				// await 없이 동시에 호출하면 getDetail이 먼저 응답을 받아
				// DB에 반영되기 전의 조회수(증가 전 값)를 화면에 표시하게 된다.
				await boardApi.incrementViewCount(id);
			}
			// increment 완료 후 getDetail을 호출해야 증가된 조회수가 화면에 표시된다.
			boardApi.getDetail(id)
				.then((res) => setPost(res.data))
				.catch(() => setPost(null));
			fileApi.getFiles(id)
				.then((res) => setFiles(res.data));
			likeApi.getStatus(id, user.userSeq)
				.then((res) => {
					if (likeBtnRef.current) {
						if (res.data.liked) {
							likeBtnRef.current.classList.add('_on');
							likeBtnRef.current.disabled = true;
						}
						const span = likeBtnRef.current.querySelector('span');
						if (span) span.textContent = `좋아요 ${res.data.likeCount}`;
					}
				});
			// 즐겨찾기 여부 조회 — 현재 로그인 유저 기준으로 초기 상태 로드
			bookmarkApi.getStatus(id, user.userSeq)
				.then((res) => {
					bookmarkBtnRef.current?.classList.toggle('_on', res.data.bookmarked);
				});
		};
		load();
	}, [id]);

	// 다운로드 버튼 클릭 시 — blob을 받아서 <a> 태그로 파일 저장
	const handleDownload = async (file) => {
		// 1단계: 서버에서 파일 데이터(blob)를 받아옴
		const res = await fileApi.download(file.fileSeq);

		// 2단계: blob 데이터로 브라우저 내 임시 URL 생성
		// blob: 파일의 실제 바이트 데이터 (이미지, PDF 등 뭐든 가능)
		// URL.createObjectURL: blob을 브라우저가 접근할 수 있는 임시 주소로 변환
		const url = URL.createObjectURL(res.data);

		// 3단계: <a> 태그를 임시로 만들어 클릭 — 브라우저 다운로드 동작 유발
		// download 속성에 파일명을 넣으면 해당 이름으로 저장됨
		const a = document.createElement('a');
		a.href = url;
		a.download = file.originalName;
		a.click();

		// 4단계: 다운로드 후 임시 URL 해제 (메모리 누수 방지)
		URL.revokeObjectURL(url);
	};

	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
				<Link to="/board" className="btn btn_list">목록으로</Link>
			</div>
		);
	}

	// 본인 글 여부 / 관리자 여부 — 둘 중 하나면 수정·삭제 버튼 노출
	const isOwner = user?.userSeq === post.userSeq;
	const isAdmin = user?.userRole === 'ADMIN' || user?.userRole === 'SUPER';
	const canDelete = isOwner || isAdmin;

	const isSecret = post.category === 'secret';
	const needsPassword = isSecret && isOwner && !isVerified; // 비밀글 + 본인 + 아직 미검증

	// 비밀글인데 관리자도 아니고 본인도 아니면 목록으로 redirect
	if (isSecret && !isAdmin && !isOwner) {
		navigate('/board');
		return null;
	}

	// 비밀번호 검증 — 성공 시 열람 허용(isVerified), 실패 시 에러 메시지 표시
	const handleVerifyPassword = async () => {
		try{
			await authApi.verifyPassword({ userId: user.userId, password: passwordInput });
			setIsVerified(true);
		} catch {
			setPasswordError("비밀번호가 틀렸습니다.")
		}
	};

	// 비밀글 + 본인 + 미검증이면 비밀번호 폼만 표시 (제목/본문/버튼 전부 숨김)
	if (needsPassword) {
		return (
			<div className="popup_overlay">
				<div className="popup_box popup_password_box">
					<h6>비밀번호를 입력하세요.</h6>
					<div className="popup_box_body">
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
								{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
							</button>
						</div>
						{passwordError && <p className="form_error">{passwordError}</p>}
					</div>
					<div className="popup_box_ft">
						<button type="button" className="btn btn_add" onClick={handleVerifyPassword}>확인</button>
						<button type="button" className="btn btn_cancel" onClick={() => navigate('/board')}>취소</button>
					</div>
				</div>
			</div>
		);
	}

	// 즐겨찾기 버튼 클릭 — 모달 먼저 띄움
	const handleBookmark = () => setIsBookmarkModal(true);

	// 모달 확인 시 실제 토글 — 서버 toggle 후 _on 클래스 직접 반영
	const confirmBookmark = async () => {
		const res = await bookmarkApi.toggle(id, user.userSeq);
		bookmarkBtnRef.current?.classList.toggle('_on', res.data.bookmarked);
		setIsBookmarkModal(false);
	};

	// 좋아요 등록 — 서버 toggle 후 카운트·_on·disabled 직접 반영 (리렌더링 없음)
	const handleLike = async () => {
		const res = await likeApi.toggle(id, user.userSeq);
		if (likeBtnRef.current) {
			likeBtnRef.current.classList.add('_on');
			likeBtnRef.current.disabled = true;
			const span = likeBtnRef.current.querySelector('span');
			if (span) span.textContent = `좋아요 ${res.data.likeCount}`;
		}
	};

	const handleDelete = async () => {
		await boardApi.delete(id);
		navigate('/board');
	};

	return (
		<div className="board_container board_detail_container">
			{/* 상단: 제목 + 메타 */}
			<div className="board_detail_hd">
				<h3 className="board_title">
					<span className={`board_info__label _${post.category}`}>{CATEGORY_LABEL[post.category]}</span>
					<span className='board_info__title'>{post.title}</span>
				</h3>
				<div className="board_detail_meta">
					<span className="board_detail_author">{post.author}</span>
					<span className="board_detail_date">{post.createdAt}</span>
					{/* API에서 내려오는 viewCount 값 표시 */}
					<span className="board_detail_view">조회 {post.viewCount.toLocaleString()}</span>
					<div className="board_btn_wrap board_hd_btn_wrap">
						{canDelete && isOwner && <Link to={`/board/${id}/edit`} state={{ verified: isVerified }} className="btn btn_edit">수정</Link>}
						{canDelete && <button className="btn btn_del" onClick={() => setIsDeleteModal(true)}>삭제</button>}
						{/* 본인 글이 아닐 때만 신고 버튼 표시 */}
						{user && !isOwner && <button className="btn btn_report" onClick={() => setIsReportModal(true)}>신고</button>}
					</div>
				</div>
			</div>

			{/* 본문 — dangerouslySetInnerHTML: TipTap이 저장한 HTML을 그대로 렌더링 */}
			<div className="board_detail_body">
				{/* 첨부파일 목록 — 본문 위에 가로 나열 */}
				{files.length > 0 && (
					<div className="board_detail_file">
						<h6 className="file_title">첨부파일</h6>
						<ul className="file_list">
							{files.map((file) => (
								<li key={file.fileSeq} className="file_list_item">
									<button type="button" className="btn_download" onClick={() => handleDownload(file)}>
										<MdAttachFile />
										{file.originalName}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
				<PostContent content={post.content} />
			</div>

			{/* 좋아요 + 즐겨찾기 버튼 영역 */}
			<div className="board_reaction_wrap">
				{/* 좋아요 — _on 시 채워진 하트·disabled, 아이콘 두 개 항상 DOM에 있고 CSS로 토글 */}
				<button ref={likeBtnRef} type="button" className="btn_reaction btn_like" onClick={handleLike}>
					<MdFavorite className="icon_on" />
					<MdFavoriteBorder className="icon_off" />
					<span>좋아요 0</span>
				</button>
				{/* 즐겨찾기 — _on 시 채워진 별, 아이콘 두 개 항상 DOM에 있고 CSS로 토글 */}
				<button ref={bookmarkBtnRef} type="button" className="btn_reaction btn_bookmark" onClick={handleBookmark}>
					<MdStar className="icon_on" />
					<MdStarBorder className="icon_off" />
					<span>즐겨찾기</span>
				</button>
			</div>


			<CommentList
				boardSeq={Number(id)}
				boardAuthorSeq={post.userSeq}
				user={user}
			/>

			{/* 하단 버튼 */}
			<div className="board_ft_wrap board_detail_ft">
				<Link to="/board" className="btn btn_list">목록</Link>
			</div>
			{isDeleteModal && (
				<Modal
					onConfirm={handleDelete}
					onCancel={() => setIsDeleteModal(false)}
				/>
			)}
			{isBookmarkModal && (
				<Modal
					message={bookmarkBtnRef.current?.classList.contains('_on') ? '즐겨찾기를 해제하시겠습니까?' : '즐겨찾기 하시겠습니까?'}
					confirmClassName="btn_add"
					onConfirm={confirmBookmark}
					onCancel={() => setIsBookmarkModal(false)}
				/>
			)}
			{isReportModal && (
				<ReportModal
					targetType="BOARD"
					targetSeq={Number(id)}
					reporterSeq={user.userSeq}
					onClose={() => setIsReportModal(false)}
				/>
			)}
			{/* ref로 _visible 클래스 직접 토글 — state 없이 fade 처리 */}
			<button ref={btnTopRef} type="button" className="btn_top" onClick={scrollToTop}>
				<MdKeyboardArrowUp />
			</button>
		</div>
	);
}

export default BoardDetail;
