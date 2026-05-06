import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/Modal';
import { CATEGORY_OPTIONS } from '../../constants';

function BoardWrite() {
	// 제목/내용/카테고리 입력값 state
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	// 카테고리 초기값은 'general' — DB에 넘길 코드값 기준
	const [category, setCategory] = useState('general');
	// 취소 확인 모달 열림/닫힘
	const [isCancelModal, setIsCancelModal] = useState(false);

	// 페이지 이동 hook
	const navigate = useNavigate();

	// 저장 버튼 — 나중에 API 호출로 교체 예정
	/*
	// 나중에 API 연동하면:
	const handleSubmit = async (e) => {
		e.preventDefault();
		await boardApi.create({ title, content });	// POST /boards
		navigate(`/board`);													// 저장 후 목록으로 이동
  };
	*/
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("title : ", title);
		console.log("content : ", content);
	};

	// 취소 버튼 — 제목/내용 입력값 있으면 모달, 없으면 바로 목록으로
	const handleCancel = () => {
		if (title || content) {
			setIsCancelModal(true);
		} else {
			navigate('/board');
		}
	};

	// 모달에서 확인 눌렀을 때 목록으로 이동
	const handleConfirmCancel = () => {
		navigate('/board');
	};

	return (
		<div className="board_container board_write_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">글쓰기</h3>
			</div>

			{/* onSubmit으로 저장 함수 연결 — button type="submit" 클릭 시 실행 */}
			<form className="board_form" onSubmit={handleSubmit}>
				{/* 카테고리 선택 — select도 input과 똑같이 value/onChange로 state 연결 */}
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
							{/* CATEGORY_OPTIONS 배열을 순회해서 option 생성 — 나중에 옵션 추가 시 constants만 수정하면 됨 */}
						{CATEGORY_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
						</select>
					</div>
				</div>

				{/* 제목 입력 — value/onChange로 state와 연결 */}
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

				{/* 내용 입력 */}
				<div className="form_group">
					<div className="board_form__title">
						<label htmlFor="content">내용</label>
					</div>
					<div className="board_form__content">
						<textarea
							id="content"
							className="textarea"
							placeholder="내용을 입력하세요"
							value={content}
							onChange={(e) => setContent(e.target.value)}
						/>
					</div>
				</div>

				<div className="board_ft_wrap board_write_ft">
					<button type="submit" className="btn btn_add">저장</button>
					<button type="button" className="btn btn_cancel" onClick={handleCancel}>취소</button>
				</div>
			</form>

			{/* 취소 확인 모달 — isCancelModal이 true일 때만 렌더링 */}
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

export default BoardWrite;
