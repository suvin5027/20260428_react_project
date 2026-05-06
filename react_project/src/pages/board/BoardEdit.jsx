import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { CATEGORY_OPTIONS } from '../../constants';

// BoardDetail이랑 같은 데이터 (나중에 API로 교체 예정)
const BOARD_DATA = {
	1: { id: 1, category: 'notice', title: 'AR 원격 협업 이용에 대한 안내 ★', author: '관리자', date: '2025.12.10 14:30', content: 'AR 원격 협업 서비스 이용 시 주의사항을 안내드립니다. 본 서비스는 실시간 화상 연결을 기반으로 하며, 안정적인 네트워크 환경에서 사용하시기 바랍니다. 이용 중 문제가 발생하면 고객센터로 문의해 주세요.' },
	2: { id: 2, category: 'notice', title: 'AR 원격 협업 지식블로그 관련 공지', author: '관리자', date: '2025.12.15 14:30', content: '지식블로그 기능이 새롭게 업데이트되었습니다. 팀원들과 노하우를 자유롭게 공유하고, 태그 검색 기능을 통해 필요한 정보를 빠르게 찾아보세요. 게시글 작성 가이드는 공지 상단 링크를 참고해 주시기 바랍니다.' },
	3: { id: 3, category: 'notice', title: '공지사항 내용이 여기에 보여집니다.', author: '관리자', date: '2025.12.12 14:30', content: '공지사항 내용이 이 곳에 표시됩니다. 중요 공지는 반드시 확인 후 업무에 참고하시기 바랍니다.' },
	4: { id: 4, category: 'general', title: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes', author: '맹구', date: '2025.12.10 14:30', content: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes, that started with the 1987 Kawasaki Ninja 600R. The original model was released in 1984 and has since grown into a worldwide phenomenon.' },
	5: { id: 5, category: 'general', title: 'The Football Is Good For Training And Recreational Purposes.', author: '김철수', date: '2025.12.10 14:30', content: 'The Football Is Good For Training And Recreational Purposes. This product features a durable outer shell and precision-balanced weight distribution for consistent performance on any surface.' },
	6: { id: 6, category: 'general', title: 'New range of formal shirts are designed keeping you in mind.', author: '유리', date: '2025.12.09 14:30', content: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart from the crowd. Available in a wide range of colors and sizes to suit every occasion.' },
	7: { id: 7, category: 'general', title: 'The beautiful range of Apple Naturale', author: '훈이', date: '2025.12.08 14:30', content: 'The beautiful range of Apple Naturale that has an exciting mix of natural ingredients. With the Goodness of 100% natural ingredients, this range is specially designed to keep you feeling fresh and vibrant all day long.' },
	8: { id: 8, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.08 14:30', content: 'Lorem ipsum dolor sit amet consectetur. Viverra amet convallis dolor proin gravida ut nam in. Sed euismod nunc pulvinar nunc sed tempus mauris tincidunt. Elementum commodo in lobortis feugiat senectus.' },
	9: { id: 9, category: 'general', title: '공지사항 내용이 여기에 보여집니다. Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.04 14:30', content: 'Pellentesque nulla varius lacinia lorem blandit facilisi in molestie tincidunt. Nibh sed diam cursus varius amet ultrices ullamcorper ornare.' },
	10: { id: 10, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et est provident unde incidunt fugiat nihil consequuntur dicta id molestiae dignissimos, quod rerum eum error accusamus aperiam dolor nesciunt quis dolorem recusandae reiciendis pariatur similique.' },
	11: { id: 11, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis.' },
};

function BoardEdit() {
	// URL에서 id 가져오기 (BoardDetail에서 했던 것과 같아)
	const { id } = useParams();
	const navigate = useNavigate();

	// id로 기존 게시글 찾기
	const post = BOARD_DATA[id];

	// 존재하지 않는 id일 경우 안내 처리 (useState보다 위에 있으면 안 돼서 이렇게 못 함 — 아래 주석 참고)
	// ※ hook(useState)은 조건문보다 반드시 먼저 선언해야 해 (React 규칙)
	//   그래서 post가 없을 때 초기값을 안전하게 '' 로 처리
	// ?. = 옵셔널 체이닝(post가 없으면(undefined) 에러 대신 그냥 undefined를 반환 : Java의 null 체크랑 비슷한 것)
	const [title, setTitle] = useState(post?.title ?? '');
	const [content, setContent] = useState(post?.content ?? '');
	// 카테고리 초기값은 기존 게시글 코드값으로 (없으면 'general')
	const [category, setCategory] = useState(post?.category ?? 'general');

	// 취소 확인 모달 열림/닫힘
	const [isCancelModal, setIsCancelModal] = useState(false);

	// 존재하지 않는 id일 경우 안내 처리
	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
			</div>
		);
	}

	// 저장 버튼 — 나중에 API 호출로 교체 예정
	/*
	// 나중에 API 연동하면:
	const handleSubmit = async (e) => {
		e.preventDefault();
		await boardApi.update(id, { title, content });	// PUT /boards/:id
		navigate(`/board/${id}`);												// 저장 후 상세로 이동
	};
	*/
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("title : ", title);
		console.log("content : ", content);
	};

	// 취소 버튼 — 입력값 변경됐으면 모달, 아니면 바로 상세로
	const handleCancel = () => {
		if (title !== post.title || content !== post.content) {
			setIsCancelModal(true);
		} else {
			navigate(`/board/${id}`);
		}
	};

	// 모달에서 확인 눌렀을 때 상세 페이지로 이동
	const handleConfirmCancel = () => {
		navigate(`/board/${id}`);
	};

	return (
		<div className="board_container board_edit_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">글수정</h3>
			</div>

			<form className="board_form" onSubmit={handleSubmit}>
				{/* 카테고리 선택 — 기존 값이 초기값으로 세팅돼 있음 */}
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
							{/* CATEGORY_OPTIONS 배열을 순회해서 option 생성 */}
							{CATEGORY_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>{opt.label}</option>
							))}
						</select>
					</div>
				</div>

				{/* 제목 입력 */}
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
					<button type="submit" className="btn btn_edit">저장</button>
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

export default BoardEdit;
