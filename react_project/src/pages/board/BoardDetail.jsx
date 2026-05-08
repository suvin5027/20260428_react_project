import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Modal from '../../components/Modal';
import { CATEGORY_LABEL } from '../../constants';
import boardApi from '../../api/boardApi';

function BoardDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [isDeleteModal, setIsDeleteModal] = useState(false);

	useEffect(() => {
		boardApi.getDetail(id)
			.then((res) => setPost(res.data))
			.catch(() => setPost(null));
	}, [id]);

	if (!post) {
		return (
			<div className="board_container">
				<p>게시글을 찾을 수 없습니다.</p>
				<Link to="/board" className="btn btn_list">목록으로</Link>
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
			<div
				className="board_detail_body"
				dangerouslySetInnerHTML={{ __html: post.content }}
			/>

			{/* 하단 버튼 */}
			<div className="board_ft_wrap board_detail_ft">
				<Link to="/board" className="btn btn_list">목록</Link>
				<div className="board_btn_wrap">
					<Link to={`/board/${id}/edit`} className="btn btn_edit">수정</Link>
					<button className="btn btn_del" onClick={() => setIsDeleteModal(true)}>삭제</button>
				</div>
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
