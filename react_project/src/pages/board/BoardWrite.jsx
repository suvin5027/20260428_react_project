import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import BoardEditor from '../../components/BoardEditor';
import { CATEGORY_OPTIONS } from '../../constants';
import { addPost } from '../../utils/boardStorage';
import { getCurrentUser, isAdmin } from '../../utils/authStorage';

// TipTap 빈 에디터는 "<p></p>"를 반환하므로 태그 제거 후 공백만 남으면 빈값으로 판단
function isEmptyContent(html) {
	return !html || html.replace(/<[^>]*>/g, '').trim() === '';
}

function BoardWrite() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('general');
	const [errors, setErrors] = useState({ title: '', content: '' });
	const [isSaveModal, setIsSaveModal] = useState(false);
	const [isCancelModal, setIsCancelModal] = useState(false);

	const navigate = useNavigate();

	const validate = () => {
		const newErrors = { title: '', content: '' };
		if (!title.trim()) newErrors.title = '제목을 입력해주세요.';
		if (isEmptyContent(content)) newErrors.content = '내용을 입력해주세요.';
		setErrors(newErrors);
		// 에러가 하나라도 있으면 false
		return !newErrors.title && !newErrors.content;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validate()) return;
		setIsSaveModal(true);
	};

	const handleConfirmSave = async () => {
		const user = getCurrentUser();

		/*
		API 연동 시 교체:
		await boardApi.create({ category, title, content });	// POST /board
		*/
		addPost({ category, title, content, author: user?.name });
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
