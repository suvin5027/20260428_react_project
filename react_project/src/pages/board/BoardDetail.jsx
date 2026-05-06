import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { CATEGORY_LABEL } from '../../constants';

// 하드코딩 게시글 데이터 (나중에 API로 교체 예정)
const BOARD_DATA = {
	1: { id: 1, category: 'notice', title: 'AR 원격 협업 이용에 대한 안내 ★', author: '관리자', date: '2025.12.10 14:30', content: 'AR 원격 협업 서비스 이용 시 주의사항을 안내드립니다. 본 서비스는 실시간 화상 연결을 기반으로 하며, 안정적인 네트워크 환경에서 사용하시기 바랍니다. 이용 중 문제가 발생하면 고객센터로 문의해 주세요.' },
	2: { id: 2, category: 'notice', title: 'AR 원격 협업 지식블로그 관련 공지', author: '관리자', date: '2025.12.15 14:30', content: '지식블로그 기능이 새롭게 업데이트되었습니다. 팀원들과 노하우를 자유롭게 공유하고, 태그 검색 가이드는 공지 상단 링크를 참고해 주시기 바랍니다.' },
	3: { id: 3, category: 'notice', title: '공지사항 내용이 여기에 보여집니다.', author: '관리자', date: '2025.12.12 14:30', content: '공지사항 내용이 이 곳에 표시됩니다. 중요 공지는 반드시 확인 후 업무에 참고하시기 바랍니다.' },
	4: { id: 4, category: 'general', title: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes', author: '맹구', date: '2025.12.10 14:30', content: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes, that started with the 1987 Kawasaki Ninja 600R. The original model was released in 1984 and has since grown into a worldwide phenomenon.' },
	5: { id: 5, category: 'general', title: 'The Football Is Good For Training And Recreational Purposes.', author: '김철수', date: '2025.12.10 14:30', content: 'The Football Is Good For Training And Recreational Purposes. This product features a durable outer shell and precision-balanced weight distribution for consistent performance on any surface.' },
	6: { id: 6, category: 'general', title: 'New range of formal shirts are designed keeping you in mind.', author: '유리', date: '2025.12.09 14:30', content: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart from the crowd. Available in a wide range of colors and sizes to suit every occasion.' },
	7: { id: 7, category: 'general', title: 'The beautiful range of Apple Naturale', author: '훈이', date: '2025.12.08 14:30', content: 'The beautiful range of Apple Naturale that has an exciting mix of natural ingredients. With the Goodness of 100% natural ingredients, this range is specially designed to keep you feeling fresh and vibrant all day long.' },
	8: { id: 8, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.08 14:30', content: 'Lorem ipsum dolor sit amet consectetur. Viverra amet convallis dolor proin gravida ut nam in. Sed euismod nunc pulvinar nunc sed tempus mauris tincidunt.' },
	9: { id: 9, category: 'general', title: '공지사항 내용이 여기에 보여집니다. Lorem ipsum dolor sit amet consectetur.', author: '신짱구', date: '2025.12.04 14:30', content: 'Pellentesque nulla varius lacinia lorem blandit facilisi in molestie tincidunt. Nibh sed diam cursus varius amet ultrices ullamcorper ornare.' },
	10: { id: 10, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et est provident unde incidunt fugiat nihil consequuntur dicta id molestiae dignissimos, quod rerum eum error accusamus aperiam dolor nesciunt quis dolorem.' },
	11: { id: 11, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis.', author: '신짱구', date: '2025.12.01 14:30', content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis.' },
};

function BoardDetail() {
	// URL의 :id 파라미터를 꺼내옴 (ex. /board/3 → id = "3")
	const { id } = useParams();
	// 페이지 이동에 쓰는 hook (Link가 아니라 함수로 이동할 때 사용)
	const navigate = useNavigate();
	// 삭제 확인 모달 열림/닫힘 상태
	const [isDeleteModal, setIsDeleteModal] = useState(false);

	// id로 게시글 찾기 (useParams는 항상 string을 반환하므로 키도 string으로 매핑됨)
	const post = BOARD_DATA[id];

	// 존재하지 않는 id일 경우 안내 처리
	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
				<Link to="/board" className="btn btn_list">목록으로</Link>
			</div>
		);
	}

	// 삭제 확인 시 목록으로 이동 (실제 API 연동 시 여기서 삭제 요청)
	const handleDelete = () => {
		navigate('/board');
	};

	return (
		<div className="board_container board_detail_container">
			{/* 상단: 제목 + 메타 */}
			<div className="board_detail_hd">
				{/* CATEGORY_LABEL 객체로 코드값(notice/general) → 한글 텍스트 변환 */}
				<h3 className="board_title">
					<span className={`board_info__label _${post.category}`}>{CATEGORY_LABEL[post.category]}</span>
					<span className='board_info__title'>{post.title}</span>
				</h3>
				<div className="board_detail_meta">
					<span className="board_detail_author">{post.author}</span>
					<span className="board_detail_date">{post.date}</span>
				</div>
			</div>

			{/* 본문 */}
			<div className="board_detail_body">
				<p>{post.content}</p>
			</div>

			{/* 하단 버튼 */}
			<div className="board_ft_wrap board_detail_ft">
				<Link to="/board" className="btn btn_list">목록</Link>
				<div className="board_btn_wrap">
					<Link to={`/board/${id}/edit`} className="btn btn_edit">수정</Link>
					{/* 클릭 시 모달 열기 */}
					<button className="btn btn_del" onClick={() => setIsDeleteModal(true)}>삭제</button>
				</div>
			</div>

			{/* 삭제 확인 모달 — isDeleteModal이 true일 때만 렌더링 */}
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
