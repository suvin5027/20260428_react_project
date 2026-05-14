import { useState, useEffect } from 'react';
import commentApi from '../api/commentApi';
import CommentItem from './CommentItem';

// -------------------------------------------------------
// flat 배열 → 트리 구조 변환
// 서버에서 오는 댓글은 flat 배열이야:
//   [{ commentSeq:1, parentSeq:null }, { commentSeq:2, parentSeq:1 }, ...]
// 이걸 아래처럼 트리로 바꿔야 CommentItem이 재귀로 렌더링할 수 있어:
//   [{ commentSeq:1, children: [{ commentSeq:2, children:[] }] }]
// -------------------------------------------------------
const flatToTree = (list) => {
	// 1단계: 각 댓글을 { ...comment, children:[] } 형태로 만들고
	//        commentSeq를 key로 하는 객체(map)에 저장
	//        → 나중에 부모를 O(1)로 바로 찾기 위해
	const map = {};
	list.forEach((c) => {
		map[c.commentSeq] = { ...c, children: [] };
	});

	// 2단계: 다시 순회하면서
	//   - parentSeq가 null이면 → 최상위 댓글 → roots에 push
	//   - parentSeq가 있으면  → 부모 댓글의 children에 push
	const roots = [];
	list.forEach((c) => {
		if (c.parentSeq === null) {
			roots.push(map[c.commentSeq]);
		} else {
			// TODO: map[c.parentSeq].children에 map[c.commentSeq] push
			map[c.parentSeq].children.push(map[c.commentSeq]);
		}
	});

	return roots;
};

function CommentList({ boardSeq, boardAuthorSeq, user }) {
	// TODO: state 3개 선언 — 아래 힌트 그대로 복붙하면 돼
	// const [comments, setComments] = useState([]);  // 트리 변환된 댓글 목록
	// const [content, setContent] = useState('');    // 새 댓글 입력값
	// const [isSecret, setIsSecret] = useState(false); // 비밀 댓글 여부
	const [comments, setComments] = useState([]);
	const [content, setContent] = useState('');
	const [isSecret, setIsSecret] = useState(false);

	// 댓글 목록을 서버에서 가져와서 트리로 변환 후 state에 저장
	const fetchComments = async () => {
		// TODO: commentApi.getList(boardSeq) 호출
		// const res = await commentApi.getList(boardSeq);
		// setComments(flatToTree(res.data));
		const res = await commentApi.getList(boardSeq);
		setComments(flatToTree(res.data));
	};

	// 마운트될 때 + boardSeq 바뀔 때 댓글 새로 로드
	useEffect(() => {
		// TODO: fetchComments() 호출
		fetchComments();
	}, [boardSeq]);

	// 새 댓글 등록
	const handleSubmit = async () => {
		// 빈 댓글 방지
		if (!content.trim()) return;

		// TODO: commentApi.insert 호출 — 아래 객체 그대로 넘기면 돼
		// await commentApi.insert(boardSeq, {
		//   userSeq: user.userSeq,
		//   author: user.nickname,
		//   content,
		//   secret: isSecret,
		//   parentSeq: null,   ← 최상위 댓글은 부모 없음
		// });
		await commentApi.insert(boardSeq, {
			userSeq: user.userSeq,
			author: user.nickname,
			content,
			secret: isSecret,
			parentSeq: null,
		});

		// TODO: 등록 후 목록 갱신 + 입력값 초기화
		// fetchComments();
		// setContent('');
		// setIsSecret(false);
		fetchComments();
		setContent('');
		setIsSecret(false);
	};

	// 전체 댓글 수 — 트리 순회 없이 flat 상태일 때 세는 게 편해서 별도 count state 대신
	// 아래처럼 재귀 함수로 셈 (삭제된 댓글도 포함해서 세야 번호가 자연스러움)
	const countAll = (nodes) => nodes.reduce((acc, n) => acc + 1 + countAll(n.children), 0);

	return (
		<div className="comment_wrap">
			{/* 댓글 수 — countAll(comments)로 계산 */}
			{/* TODO: 아래 줄 주석 해제
			<p className="comment_count">댓글 <span>{countAll(comments)}</span>개</p> */}
			{comments.length > 0 && <div className="comment_list_wrap">
				<p className="comment_count">댓글 <span>{countAll(comments)}</span>개</p>

				{/* 댓글 목록 — roots(최상위)만 map, 대댓글은 CommentItem 안에서 재귀로 처리 */}
				{/* TODO: 아래 블록 주석 해제
				<ul className="comment_list">
					{comments.map((comment) => (
						<CommentItem
							key={comment.commentSeq}
							comment={comment}
							boardSeq={boardSeq}
							boardAuthorSeq={boardAuthorSeq}
							user={user}
							onRefresh={fetchComments}
						/>
					))}
				</ul> */}
				<ul className="comment_list">
					{comments.map((comment) => (
						<CommentItem
							key={comment.commentSeq}
							comment={comment}
							boardSeq={boardSeq}
							boardAuthorSeq={boardAuthorSeq}
							user={user}
							onRefresh={fetchComments}
						/>
					))}
				</ul>
			</div>}

			{/* 새 댓글 작성 폼 — 로그인 상태일 때만 보임 */}
			{user && (
				<div className="comment_write">
					<div className="comment_write_row">
						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="댓글을 입력하세요."
						/>
						<button type="button" className="btn btn_add" onClick={handleSubmit}>등록</button>
					</div>
					<label className="comment_write_secret">
						<input
							type="checkbox"
							checked={isSecret}
							onChange={(e) => setIsSecret(e.target.checked)}
						/>
						<span>비밀 댓글</span>
					</label>
				</div>
			)}
		</div>
	);
}

export default CommentList;
