import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from '../../components/Modal';
import { CATEGORY_LABEL } from '../../constants';
import boardApi from '../../api/boardApi';
import fileApi from '../../api/fileApi';
import { MdAttachFile, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { getCurrentUser } from '../../utils/authStorage';
import authApi from '../../api/authApi';

function BoardDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const [post, setPost] = useState(null);
	const [files, setFiles] = useState([]); // 첨부파일 목록
	const [isDeleteModal, setIsDeleteModal] = useState(false);
	// 비밀글 비밀번호 검증 관련 state
	const [isVerified, setIsVerified] = useState(location.state?.verified || false); // 비밀번호 검증 통과 여부 (List에서 넘어온 경우 true)
	const [passwordInput, setPasswordInput] = useState(''); // 입력한 비밀번호
	const [passwordError, setPasswordError] = useState(''); // 비밀번호 오류 메시지
	const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김
	const user = getCurrentUser(); // 현재 로그인 유저

	useEffect(() => {
		boardApi.getDetail(id)
			.then((res) => setPost(res.data))
			.catch(() => setPost(null));
		fileApi.getFiles(id)
			.then((res) => setFiles(res.data));
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
	const isAdmin = user?.userRole === 'ADMIN';
	const canEdit = isOwner || isAdmin;

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
			<div className="board_container board_detail_container">
				<div className="detail_password_box">
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
							{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
						</button>
					</div>
					{passwordError && <p className="form_error">{passwordError}</p>}
					<div className="popup_box_ft">
						<button type="button" className="btn btn_add" onClick={handleVerifyPassword}>확인</button>
						<button type="button" className="btn btn_cancel" onClick={() => navigate('/board')}>취소</button>
					</div>
				</div>
			</div>
		);
	}

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
				</div>
			</div>

			{/* 본문 — dangerouslySetInnerHTML: TipTap이 저장한 HTML을 그대로 렌더링 */}
			<div className="board_detail_body">
				<div dangerouslySetInnerHTML={{ __html: post.content }} />
			</div>

			{files.length > 0 && (
				<div className="board_detail_footer">
					<h6 className="file_title">첨부파일 다운로드</h6>
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

			{/* 하단 버튼 */}
			<div className="board_ft_wrap board_detail_ft">
				<Link to="/board" className="btn btn_list">목록</Link>
				{canEdit && (
					<div className="board_btn_wrap">
						<Link to={`/board/${id}/edit`} state={{ verified: isVerified }} className="btn btn_edit">수정</Link>
						<button className="btn btn_del" onClick={() => setIsDeleteModal(true)}>삭제</button>
					</div>
				)}
			</div>
			{isDeleteModal && (
				<Modal
					onConfirm={handleDelete}
					onCancel={() => setIsDeleteModal(false)}
				/>
			)}
		</div>
	);
}

export default BoardDetail;
