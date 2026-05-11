import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import BoardEditor from '../../components/BoardEditor';
import { CATEGORY_OPTIONS, FILE_MAX_COUNT, FILE_MAX_SIZE, FILE_ALLOWED_TYPES } from '../../constants';
import boardApi from '../../api/boardApi';
import fileApi from '../../api/fileApi';
import { getCurrentUser, isAdmin } from '../../utils/authStorage';
import { MdCancel } from 'react-icons/md';

// TipTap 빈 에디터는 "<p></p>"를 반환하므로 태그 제거 후 공백만 남으면 빈값으로 판단
function isEmptyContent(html) {
	return !html || html.replace(/<[^>]*>/g, '').trim() === '';
}

function BoardWrite() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('general');
	const [files, setFiles] = useState([]); // 선택한 파일 목록
	const [fileError, setFileError] = useState('');
	const [errors, setErrors] = useState({ title: '', content: '' });
	const [isSaveModal, setIsSaveModal] = useState(false);
	const [isCancelModal, setIsCancelModal] = useState(false);

	// 파일 선택 시 기존 목록에 새 파일을 추가
	const handleFileChange = (e) => {
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
		if (files.length + selected.length > FILE_MAX_COUNT) {
			setFileError(`파일은 최대 ${FILE_MAX_COUNT}개까지 첨부할 수 있습니다.`);
			return;
		}

		setFileError('');
		setFiles([...files, ...selected]);
	};

	// 파일 목록에서 X 버튼을 누른 파일 한 개를 제거
	const handleFileRemove = (idx) => {
		// [기본 버전]
		// filter: 배열을 처음부터 끝까지 돌면서 조건이 true인 것만 남긴 '새 배열'을 돌려줌
		// (_, i) → _는 파일 값(안 씀), i는 지금 몇 번째인지(인덱스)
		// i !== idx → 클릭한 번호(idx)랑 다른 것만 남김 = 클릭한 것만 빠짐
		// const nextFiles = files.filter((_, i) => i !== idx);
		// setFiles(nextFiles);

		// [클린 버전] React 권장 패턴 — prevFiles는 React가 넘겨주는 "진짜 최신 state"
		// 직접 files를 읽는 것보다 안전하고, 변수 선언 없이 한 줄로 끝남
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== idx));
	};

	const navigate = useNavigate();

	const validate = () => {
		const newErrors = { title: '', content: '' };
		if (!title.trim()) newErrors.title = '제목을 입력해주세요.';
		if (isEmptyContent(content)) newErrors.content = '내용을 입력해주세요.';
		setErrors(newErrors);
		return !newErrors.title && !newErrors.content;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;
		setIsSaveModal(true);
	};

	const handleConfirmSave = async () => {
		const user = getCurrentUser();

		// 게시글 저장 후 응답에서 boardSeq 꺼내기
		const res = await boardApi.create({ category, title, content, userSeq: user?.userSeq });
		const boardSeq = res.data.boardSeq;

		// 파일이 있을 때만 업로드 (없으면 건너뜀)
		if (files.length > 0) {
			await fileApi.upload(boardSeq, files);
		}

		navigate('/board');
	};

	const handleCancel = () => {
		if (title || !isEmptyContent(content)) {
			setIsCancelModal(true);
		} else {
			navigate('/board');
		}
	};

	const handleConfirmCancel = () => {
		navigate('/board');
	};

	return (
		<div className="board_container board_write_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">글쓰기</h3>
			</div>

			<form className="board_form" onSubmit={handleSubmit}>
				<div className="form_group">
					<div className='board_form__title'>
						<label htmlFor="category">카테고리</label>
					</div>
					<div className='board_form__content'>
						<select
							id="category"
							className="select"
							value={category}
							onChange={(e) => setCategory(e.target.value)}
						>
						{CATEGORY_OPTIONS.filter((opt) => opt.value !== 'notice' || isAdmin()).map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
						</select>
					</div>
				</div>

				<div className="form_group">
					<div className="board_form__title">
						<label htmlFor="title" className="_required">제목</label>
					</div>
					<div className="board_form__content">
						<input
							id="title"
							type="text"
							className={`input_text${errors.title ? ' _error' : ''}`}
							placeholder="제목을 입력하세요"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
							}}
						/>
						{errors.title && <p className="form_error">{errors.title}</p>}
					</div>
				</div>

				<div className="form_group">
					<div className="board_form__title">
						<span className="_required">내용</span>
					</div>
					<div className="board_form__content">
						<BoardEditor value={content} onChange={(val) => {
							setContent(val);
							if (errors.content) setErrors((prev) => ({ ...prev, content: '' }));
						}} />
						{errors.content && <p className="form_error">{errors.content}</p>}
					</div>
				</div>

				{/* 첨부파일 */}
				<div className="form_group">
					<div className="board_form__title">
						<label>첨부파일</label>
					</div>
					<div className="board_form__content">
						<input
							type="file"
							id="file_input"
							multiple
							className="file_input"
							accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
							onChange={handleFileChange}
						/>
						<label htmlFor="file_input" className="btn btn_file">파일 선택</label>
						{fileError && <p className="form_error">{fileError}</p>}
						{files.length > 0 && (
							<ul className="file_list">
								{files.map((file, idx) => (
									<li key={idx} className="file_list_item">
										<span className="file_name">{file.name}</span>
										<button type="button" className="btn_file_del" onClick={() => handleFileRemove(idx)}>
											<MdCancel />
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div className="board_ft_wrap board_write_ft">
					<button type="submit" className="btn btn_add">저장</button>
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
					message="작성 중인 내용이 있습니다. 취소하시겠습니까?"
					onConfirm={handleConfirmCancel}
					onCancel={() => setIsCancelModal(false)}
				/>
			)}
		</div>
	);
}

export default BoardWrite;
