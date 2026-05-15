import { useState } from 'react';
import { MdLock } from 'react-icons/md';
import commentApi from '../api/commentApi';
import Modal from './Modal';

// 댓글 1개를 그리는 컴포넌트 — 자식 댓글이 있으면 자기 자신을 다시 호출(재귀)
function CommentItem({ comment, boardSeq, boardAuthorSeq, parentAuthorSeq, user, onRefresh }) {

	// -------------------------------------------------------
	// state — 폼 열림/닫힘 + 입력값
	// -------------------------------------------------------
	// TODO: 아래 5개 선언 (힌트 그대로 복붙)
	// const [replyMode, setReplyMode] = useState(false);    // 답글 폼 열림 여부
	// const [editMode, setEditMode] = useState(false);      // 수정 폼 열림 여부
	// const [replyContent, setReplyContent] = useState(''); // 답글 입력값
	// const [editContent, setEditContent] = useState(comment.content); // 수정 입력값 (기존 내용으로 초기화)
	// const [replySecret, setReplySecret] = useState(false); // 답글 비밀 여부
	const [replyMode, setReplyMode] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [replyContent, setReplyContent] = useState('');
	const [editContent, setEditContent] = useState(comment.content);
	const [replySecret, setReplySecret] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// -------------------------------------------------------
	// 권한 체크 — true/false 변수로 미리 계산해두면 JSX가 깔끔해져
	// -------------------------------------------------------
	// TODO: 아래 3개 선언
	// const canEdit       = comment.userSeq === user?.userSeq;   // 본인만 수정 가능
	// const canDelete     = comment.userSeq === user?.userSeq || user?.userRole === 'ADMIN';  // 본인 또는 관리자
	// const canSeeSecret  = comment.userSeq === user?.userSeq    // 작성자 본인
	//                    || boardAuthorSeq  === user?.userSeq    // 게시글 작성자
	//                    || user?.userRole  === 'ADMIN';         // 관리자
	const canEdit = comment.userSeq === user?.userSeq;
	const isAdmin = user?.userRole === "ADMIN" || user?.userRole === "SUPER";
	const canDelete = comment.userSeq === user?.userSeq || isAdmin;
	const canSeeSecret = comment.userSeq === user?.userSeq    // 댓글 작성자 본인
											|| boardAuthorSeq === user?.userSeq    // 게시글 작성자
											|| parentAuthorSeq === user?.userSeq   // 부모 댓글 작성자 (대댓글 비밀 열람)
											|| isAdmin;                            // 관리자

	// -------------------------------------------------------
	// 표시 분기 — 이 두 값으로 아래 JSX에서 3가지 케이스 처리
	// -------------------------------------------------------
	// TODO: 아래 2개 선언
	// const isDeleted = comment.deleted;                    // soft delete된 댓글
	// const isHidden  = comment.secret && !canSeeSecret;   // 비밀 댓글인데 열람 권한 없음
	const isDeleted = comment.deleted;
	const isHidden = comment.secret && !canSeeSecret;

	// -------------------------------------------------------
	// 핸들러
	// -------------------------------------------------------

	// 댓글 수정 저장
	const handleEdit = async () => {
		// TODO: commentApi.update 호출 후 editMode 닫고 목록 갱신
		// await commentApi.update(boardSeq, comment.commentSeq, { content: editContent });
		// setEditMode(false);
		// onRefresh();
		await commentApi.update(boardSeq, comment.commentSeq, { content: editContent });
		setEditMode(false);
		onRefresh();
	};

	// 댓글 삭제 (대댓글 있으면 Spring에서 soft delete, 없으면 hard delete — 프론트는 그냥 호출만)
	const handleDelete = async () => {
		// 관리자가 남의 댓글을 삭제하는 경우만 ADMIN, 나머지는 USER
		const deletedBy = isAdmin && comment.userSeq !== user?.userSeq ? 'ADMIN' : 'USER';
		await commentApi.delete(boardSeq, comment.commentSeq, deletedBy);
		onRefresh();
	};

	// 답글 등록
	const handleReply = async () => {
		if (!replyContent.trim()) return;
		// TODO: commentApi.insert 호출 — parentSeq에 현재 댓글 seq 넣는 게 핵심!
		// await commentApi.insert(boardSeq, {
		//   userSeq: user.userSeq,
		//   author: user.nickname,
		//   content: replyContent,
		//   secret: replySecret,
		//   parentSeq: comment.commentSeq,  ← 이 댓글의 자식으로 등록
		// });
		// setReplyMode(false);
		// setReplyContent('');
		// onRefresh();
		await commentApi.insert(boardSeq, {
			userSeq: user.userSeq,
			author: user.nickname,
			content: replyContent,
			secret: replySecret,
			parentSeq: comment.commentSeq,
		});
		setReplyMode(false);
		setReplyContent('');
		onRefresh();
	};

	return (
		<li className={`comment_item${comment.deleted ? ' _masked' : ''}`}>

			{/* -------------------------------------------------------
			    댓글 본문 — isDeleted / isHidden / 정상 3가지 분기
			    삼항 연산자를 2번 중첩해서 표현해:
			      isDeleted ? A : isHidden ? B : C
			------------------------------------------------------- */}
			{/* TODO: 아래 블록 주석 해제
			{isDeleted ? (
				// 케이스 A: 삭제된 댓글 — 내용 숨기고 안내문만 표시
				<p className="comment_content">삭제된 댓글입니다.</p>
			) : isHidden ? (
				// 케이스 B: 비밀 댓글인데 권한 없음 — 내용 숨기고 안내문만 표시
				<p className="comment_content">비밀 댓글입니다.</p>
			) : (
				// 케이스 C: 정상 표시
				<>
					<div className="comment_hd">
						<span className="comment_author">{comment.author}</span>
						<span className="comment_date">{comment.createdAt}</span>
						<div className="comment_btn_wrap">
							{user && (
								<button className="btn_comment" onClick={() => setReplyMode(!replyMode)}>
									답글
								</button>
							)}
							{canEdit && (
								<button className="btn_comment" onClick={() => setEditMode(true)}>
									수정
								</button>
							)}
							{canDelete && (
								<button className="btn_comment btn_del" onClick={() => setShowDeleteModal(true)}>
									삭제
								</button>
							)}
						</div>
					</div>
					{!editMode && <p className="comment_content">{comment.content}</p>}
				</>
			)} */}
			{isDeleted ? (
				<p className="comment_content">
					{comment.deletedBy === 'ADMIN' ? '관리자에 의해 삭제된 댓글입니다.' : '삭제된 댓글입니다.'}
				</p>
			) : isHidden ? (
				<p className="comment_content">비밀 댓글입니다.</p>
			) : (
				<>
					<h6 className="comment_hd">
						<span className="comment_author">
							{comment.secret && <MdLock className="icon_secret" />}
							{comment.author}
						</span>
						<span className="comment_date">{comment.createdAt}</span>
						<div className="comment_btn_wrap">
							{user && (
								<button className="btn_comment" onClick={() => setReplyMode(!replyMode)}>
									답글
								</button>
							)}
							{canEdit && (
								<button className="btn_comment" onClick={() => setEditMode(true)}>
									수정
								</button>
							)}
							{canDelete && (
								<button className="btn_comment btn_del" onClick={() => setShowDeleteModal(true)}>
									삭제
								</button>
							)}
						</div>
					</h6>
					{!editMode && <p className="comment_content">{comment.content}</p>}
				</>
			)}

			{/* -------------------------------------------------------
			    수정 폼 — editMode가 true일 때만 표시
			    (isDeleted, isHidden이면 editMode 자체가 켜지지 않으니 조건 안 써도 됨)
			------------------------------------------------------- */}
			{/* TODO: 아래 블록 주석 해제
			{editMode && (
				<div className="comment_form">
					<textarea
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					/>
					<div className="comment_form_ft">
						<div>
							<button className="btn btn_add" onClick={handleEdit}>저장</button>
							<button className="btn btn_cancel" onClick={() => setEditMode(false)}>취소</button>
						</div>
					</div>
				</div>
			)} */}
			{editMode && (
				<div className="comment_form">
					<textarea
						id="commentTextarea"
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
					/>
					<div className="comment_form_ft">
						<div>
							<button type="button" className="btn btn_add" onClick={handleEdit}>저장</button>
							<button type="button" className="btn btn_cancel" onClick={() => setEditMode(false)}>취소</button>
						</div>
					</div>
				</div>
			)}

			{/* -------------------------------------------------------
			    답글 폼 — replyMode가 true일 때만 표시
			------------------------------------------------------- */}
			{/* TODO: 아래 블록 주석 해제
			{replyMode && (
				<div className="comment_form">
					<textarea
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						placeholder="답글을 입력하세요."
					/>
					<div className="comment_form_ft">
						<label>
							<input
								type="checkbox"
								checked={replySecret}
								onChange={(e) => setReplySecret(e.target.checked)}
							/>
							비밀 댓글
						</label>
						<div>
							<button className="btn btn_add" onClick={handleReply}>등록</button>
							<button className="btn btn_cancel" onClick={() => setReplyMode(false)}>취소</button>
						</div>
					</div>
				</div>
			)} */}
			{replyMode && (
				<div className="comment_form">
					<textarea
						id="replyTextarea"
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
					/>
					<div className="comment_form_ft">
						<label>
							<input
								type="checkbox"
								checked={replySecret}
								onChange={(e) => setReplySecret(e.target.checked)}
							/>
							비밀 댓글
						</label>
						<div>
							<button type="button" className="btn btn_add" onClick={handleReply}>등록</button>
							<button type="button" className="btn btn_cancel" onClick={() => setReplyMode(false)}>취소</button>
						</div>
					</div>
				</div>
			)}

			{/* -------------------------------------------------------
			    대댓글 재귀 렌더링 — children 배열이 있으면 자기 자신을 다시 그림
			    CommentItem 안에서 CommentItem을 호출하는 게 재귀야!
			------------------------------------------------------- */}
			{/* TODO: 아래 블록 주석 해제
			{comment.children.length > 0 && (
				<ul className="comment_children">
					{comment.children.map((child) => (
						<CommentItem
							key={child.commentSeq}
							comment={child}
							boardSeq={boardSeq}
							boardAuthorSeq={boardAuthorSeq}
							user={user}
							onRefresh={onRefresh}
						/>
					))}
				</ul>
			)} */}
			{comment.children.length > 0 && (
				<ul className="comment_children">
					{comment.children.map((child) => (
						<CommentItem
							key={child.commentSeq}
							comment={child}
							boardSeq={boardSeq}
							boardAuthorSeq={boardAuthorSeq}
							parentAuthorSeq={comment.userSeq}
							user={user}
							onRefresh={onRefresh}
						/>
					))}
				</ul>
			)}

		{showDeleteModal && (
				<Modal
					message="댓글을 삭제하시겠습니까?"
					onConfirm={() => { setShowDeleteModal(false); handleDelete(); }}
					onCancel={() => setShowDeleteModal(false)}
				/>
			)}
		</li>
	);
}

export default CommentItem;
