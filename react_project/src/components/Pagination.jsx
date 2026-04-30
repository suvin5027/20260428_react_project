// currentPage: 현재 페이지 번호 / totalPages: 전체 페이지 수 / onPageChange: 페이지 바꾸는 함수
function Pagination({ currentPage, totalPages, onPageChange }) {
	return (
		<div className="pagination_wrap">
			{/* 첫 페이지 버튼 — 1페이지면 disabled */}
			<button
				className="pagination_btn pagination_btn__first"
				onClick={() => onPageChange(1)}
				disabled={currentPage === 1}
			>&lt;&lt;</button>

			{/* 이전 버튼 — 1페이지면 disabled (클릭 불가) */}
			<button
				className="pagination_btn pagination_btn__prev"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>&lt;</button>

			{/* 페이지 번호 목록 */}
			<ul className="pagination_list">
				{/* Array.from으로 [1, 2, 3 ...] 배열 만들어서 버튼 렌더링 */}
				{/* ex) totalPages가 3이면 → [1, 2, 3] 생성 */}
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<li key={page} className="pagination_item">
						{/* 현재 페이지면 _active 클래스 추가 */}
						<button
							className={`pagination_btn__page${currentPage === page ? ' _active' : ''}`}
							onClick={() => onPageChange(page)}
						>{page}</button>
					</li>
				))}
			</ul>

			{/* 다음 버튼 — 마지막 페이지면 disabled (클릭 불가) */}
			<button
				className="pagination_btn pagination_btn__next"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>&gt;</button>

			{/* 마지막 페이지 버튼 — 마지막 페이지면 disabled */}
			<button
				className="pagination_btn pagination_btn__last"
				onClick={() => onPageChange(totalPages)}
				disabled={currentPage === totalPages}
			>&gt;&gt;</button>
		</div>
	);
}

export default Pagination;
