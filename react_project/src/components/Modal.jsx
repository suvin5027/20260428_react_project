// props: message(모달 문구), confirmClassName(확인 버튼 클래스, 기본 btn_del), onConfirm, onCancel
function Modal({ message = '정말 삭제하시겠습니까?', confirmClassName = 'btn_del', onConfirm, onCancel }) {
	return (
		<>
			{/* 배경 어둡게 처리, 클릭 시 모달 닫기 */}
			<div className="popup_overlay" onClick={onCancel} />
			<div className="popup">
				<div className="popup_body">
					<p className="popup_msg">{message}</p>
				</div>
				<div className="popup_footer">
					{/* onConfirm: 부모에서 받은 함수 실행 (ex. 삭제 처리) */}
					<button className={`btn ${confirmClassName}`} onClick={onConfirm}>확인</button>
					<button className="btn btn_cancel" onClick={onCancel}>취소</button>
				</div>
			</div>
		</>
	);
}

export default Modal;
