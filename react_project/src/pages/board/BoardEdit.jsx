import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import BoardEditor from '../../components/BoardEditor';
import { CATEGORY_OPTIONS } from '../../constants';
import boardApi from '../../api/boardApi';
import { isAdmin } from '../../utils/authStorage';

function BoardEdit() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [post, setPost] = useState(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [category, setCategory] = useState('general');
	const [isSaveModal, setIsSaveModal] = useState(false);
	const [isCancelModal, setIsCancelModal] = useState(false);

	useEffect(() => {
		boardApi.getDetail(id).then((res) => {
			const data = res.data;
			setPost(data);
			setTitle(data.title);
			setContent(data.content);
			setCategory(data.category);
		});
	}, [id]);

	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
			</div>
		);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSaveModal(true);
	};

	const handleConfirmSave = async () => {
		await boardApi.update(id, { category, title, content });
		navigate(`/board/${id}`);
	};

	const handleCancel = () => {
		if (title !== post.title || content !== post.content) {
			setIsCancelModal(true);
		} else {
			navigate(`/board/${id}`);
		}
	};

	const handleConfirmCancel = () => {
		navigate(`/board/${id}`);
	};

	return (
		<div className="board_container board_edit_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">글수정</h3>
			</div>

			<form className="board_form" onSubmit={handleSubmit}>
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
