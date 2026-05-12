import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from '../../components/Modal';
import BoardEditor from '../../components/BoardEditor';
import { CATEGORY_OPTIONS, FILE_MAX_COUNT, FILE_MAX_SIZE, FILE_ALLOWED_TYPES } from '../../constants';
import boardApi from '../../api/boardApi';
import fileApi from '../../api/fileApi';
import authApi from '../../api/authApi';
import { getCurrentUser, isAdmin } from '../../utils/authStorage';
import { MdCancel, MdDownload, MdVisibility, MdVisibilityOff } from 'react-icons/md';

function BoardEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const user = getCurrentUser();

	const [post, setPost] = useState(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('general');
	const [secret, setSecret] = useState(false); // 비밀글 여부
	const [existingFiles, setExistingFiles] = useState([]); // DB에 저장된 기존 파일
	const [newFiles, setNewFiles] = useState([]); // 새로 추가할 파일
	const [deletedFileSeqs, setDeletedFileSeqs] = useState([]); // 삭제할 파일 seq
	const [fileError, setFileError] = useState('');
	const [isSaveModal, setIsSaveModal] = useState(false);
	const [isCancelModal, setIsCancelModal] = useState(false);
	// Detail에서 검증 후 넘어온 경우 location.state?.verified || false로 초기값 세팅
	const [isVerified, setIsVerified] = useState(location.state?.verified || false);
	const [passwordInput, setPasswordInput] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// 기존 파일 X 버튼 클릭 시 — 저장 시 일괄 삭제하도록 seq만 기록, 화면에서 즉시 제거
	const handleExistingFileRemove = (fileSeq) => {
		setDeletedFileSeqs([...deletedFileSeqs, fileSeq]);
		setExistingFiles((prev) => prev.filter((file) => file.fileSeq !== fileSeq));
	};

	// 파일 선택 시 기존 목록에 새 파일을 추가
	const handleNewFileChange = (e) => {
		const selected = Array.from(e.target.files);

		const invalidType = selected.find((f) => !FILE_ALLOWED_TYPES.includes(f.type));
		if (invalidType) {
			setFileError(`허용되지 않는 파일 형식입니다. (${invalidType.name})`);
			return;
		}
		const oversized = selected.find((f) => f.size > FILE_MAX_SIZE);
		if (oversized) {
			setFileError(`파일 크기는 ${FILE_MAX_SIZE / 1024 / 1024}MB 이하여야 합니다. (${oversized.name})`);
			return;
		}
		// 기존 파일 수 + 새 파일 수 합산해서 개수 검사
		if (existingFiles.length + newFiles.length + selected.length > FILE_MAX_COUNT) {
			setFileError(`파일은 최대 ${FILE_MAX_COUNT}개까지 첨부할 수 있습니다.`);
			return;
		}

		setFileError('');
		setNewFiles([...newFiles, ...selected]);
	};

	// 새로 추가한 파일 X 버튼 클릭 시 제거
	const handleNewFileRemove = (idx) => {
		setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== idx));
	};

	useEffect(() => {
		boardApi.getDetail(id).then((res) => {
			const data = res.data;
			setPost(data);
			setTitle(data.title);
			setContent(data.content);
			setCategory(data.category);
			setSecret(data.category === 'secret'); // 기존 비밀글 여부 초기값 세팅
		});

		fileApi.getFiles(id).then((res) => {
			setExistingFiles(res.data);
		});

	}, [id]);

	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
			</div>
		);
	}

	const isOwner = user?.userSeq === post.userSeq;
	const isAdminUser = user?.userRole === 'ADMIN';
	const isSecret = post.category === 'secret';

	// 비밀글인데 관리자도 아니고 본인도 아니면 목록으로 redirect
	if (isSecret && !isAdminUser && !isOwner) {
		navigate('/board');
		return null;
	}

	// 비밀글 + 본인 + 미검증이면 비밀번호 폼만 표시
	const needsPassword = isSecret && isOwner && !isAdminUser && !isVerified;

	// 비밀번호 검증 — 성공 시 열람 허용(isVerified), 실패 시 에러 메시지 표시
	const handleVerifyPassword = async () => {
		try {
			await authApi.verifyPassword({ userId: user.userId, password: passwordInput });
			setIsVerified(true);
		} catch {
			setPasswordError('비밀번호가 틀렸습니다.');
		}
	};

	if (needsPassword) {
		return (
			<div className="board_container board_edit_container">
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

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSaveModal(true);
	};

	const handleConfirmSave = async () => {
		// 삭제 표시된 파일 먼저 처리
		for (const fileSeq of deletedFileSeqs) {
			await fileApi.delete(fileSeq);
		}

		// 게시글 수정 후 응답에서 boardSeq 꺼내기
		const res = await boardApi.update(id, { category, title, content, isSecret: secret ? 1 : 0 }); // 비밀글이면 1, 아니면 0
		const boardSeq = res.data.boardSeq;

		// 새 파일이 있을 때만 업로드
		if (newFiles.length > 0) {
			await fileApi.upload(boardSeq, newFiles);
		}

		navigate(`/board/${id}`);
	};

	const handleCancel = () => {
		if (title !== post.title || content !== post.content) {
			setIsCancelModal(true);
		} else {
			navigate(`/board/${id}`, { state: { verified: isVerified } });
		}
	};

	const handleConfirmCancel = () => {
		navigate(`/board/${id}`, { state: { verified: isVerified } });
	};

	return (
		<div className="board_container board_edit_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">글수정</h3>
			</div>

			<form className="board_form" onSubmit={handleSubmit}>
				<div className="form_group">
					<div className='board_form__title'>
						<label htmlFor="secret">비밀글 여부</label>
					</div>
					<div className='board_form__content'>
						<input
							type="checkbox"
							name="secret"
							id="secret"
							className="input_check"
							checked={secret}
							onChange={(e) => {
								setSecret(e.target.checked) // 비밀글 여부 — true/false
								setCategory(e.target.checked ? 'secret' : 'general') // 카테고리 변경 → 목록에서 board_info__label에 '비밀글' 표시하기 위해
							}}
						/>
					</div>
				</div>

				<div className="form_group">
					<div className="board_form__title">
						<label htmlFor="category">카테고리</label>
					</div>
					<div className="board_form__content">
						<select
							id="category"
							className="select"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							disabled={secret} // 비밀글 체크 시 카테고리 변경 불가
						>
							{CATEGORY_OPTIONS.filter((opt) => opt.value !== 'notice' || isAdmin()).map((opt) => (
								<option key={opt.value} value={opt.value}>{opt.label}</option>
							))}
						</select>
					</div>
				</div>

				<div className="form_group">
					<div className="board_form__title">
						<label htmlFor="title">제목</label>
					</div>
					<div className="board_form__content">
						<input
							id="title"
							type="text"
							className="input_text"
							placeholder="제목을 입력하세요"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
						/>
					</div>
				</div>

				<div className="form_group">
					<div className="board_form__title">
						<label>내용</label>
					</div>
					<div className="board_form__content">
						{/* 기존 내용이 초기값으로 세팅된 상태로 에디터 열림 */}
						<BoardEditor value={content} onChange={setContent} />
					</div>
				</div>

				{/* 첨부파일 */}
				<div className="form_group">
					<div className="board_form__title">
						<label>첨부파일</label>
					</div>
					<div className="board_form__content">
						{/* 기존 파일 목록 */}
						{existingFiles.length > 0 && (
							<ul className="file_list">
								{existingFiles.map((file) => (
									<li key={file.fileSeq} className="file_list_item">
										<span className="file_name">{file.originalName}</span>
										<button type="button" className="btn_file_del" onClick={() => handleExistingFileRemove(file.fileSeq)}>
											<MdCancel />
										</button>
									</li>
								))}
							</ul>
						)}
						{/* 새 파일 추가 */}
						<input
							type="file"
							id="file_input"
							multiple
							className="file_input"
							accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
							onChange={handleNewFileChange}
						/>
						<label htmlFor="file_input" className="btn btn_file">파일 추가</label>
						{fileError && <p className="form_error">{fileError}</p>}
						{newFiles.length > 0 && (
							<ul className="file_list">
								{newFiles.map((file, idx) => (
									<li key={idx} className="file_list_item">
										<span className="file_name">{file.name}</span>
										<button type="button" className="btn_file_del" onClick={() => handleNewFileRemove(idx)}>
											<MdCancel />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="board_ft_wrap board_write_ft">
					<button type="submit" className="btn btn_edit">저장</button>
					<button type="button" className="btn btn_cancel" onClick={handleCancel}>취소</button>
				</div>
			</form>

			{isSaveModal && (
				<Modal
					message="저장하시겠습니까?"
					onConfirm={handleConfirmSave}
					onCancel={() => setIsSaveModal(false)}
				/>
			)}

			{isCancelModal && (
				<Modal
					message="수정된 내용이 있습니다. 취소하시겠습니까?"
					onConfirm={handleConfirmCancel}
					onCancel={() => setIsCancelModal(false)}
				/>
			)}
		</div>
	);
}

export default BoardEdit;
