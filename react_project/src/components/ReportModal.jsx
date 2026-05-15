import { useState } from 'react';
import reportApi from '../api/reportApi';

// 신고 사유 옵션 — 객체로 선언해서 value(키)와 label(값) 쌍으로 관리
// export로 내보내면 AdminReportList 등 다른 곳에서도 라벨 재사용 가능
export const REASON_OPTIONS = {
	ABUSE:   '욕설/혐오',
	SPAM:    '스팸/광고',
	OBSCENE: '음란물',
	ETC:     '기타',
};

// props: targetType('BOARD'/'COMMENT'), targetSeq, reporterSeq, onClose
function ReportModal({ targetType, targetSeq, reporterSeq, onClose }) {
	const [reason, setReason] = useState("ABUSE");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		// API 호출 전에 loading을 true로 설정해 버튼 중복 클릭 방지
		setLoading(true);
		try {
			// 신고 등록 요청 — Spring에서 중복이면 409, 성공이면 200 반환
			await reportApi.report({ targetType, targetSeq, reporterSeq, reason });
			alert("신고가 접수되었습니다.");
			onClose();
		} catch (e) {
			// e.response.status로 HTTP 상태코드 확인 — axios는 4xx/5xx를 catch로 보냄
			if (e.response?.status === 409) {
				alert("이미 신고한 게시물입니다.");
			} else {
				alert("신고 중 오류가 발생했습니다.");
			}
			onClose();
		} finally {
			// 성공/실패 모두 loading 해제
			setLoading(false);
		}
	};

	return (
		<>
			{/* 배경 어둡게 — 클릭 시 모달 닫기 */}
			<div className="popup_overlay" onClick={onClose} />
			<div className="popup_box report_modal">
				<h6>신고 사유 선택</h6>

				{/* Object.entries()로 객체를 [key, label] 쌍 배열로 변환 후 렌더링 */}
				{/* 예: ['ABUSE', '욕설/혐오'], ['SPAM', '스팸/광고'] ... */}
				<ul className="report_reason_list">
					{Object.entries(REASON_OPTIONS).map(([value, label]) => (
						<li key={value}>
							<label className="report_reason_item">
								{/* checked: 현재 선택된 reason과 이 항목의 value가 같으면 선택 상태 */}
								<input
									type="radio"
									name="reason"
									value={value}
									checked={reason === value}
									onChange={() => setReason(value)}
								/>
								{label}
							</label>
						</li>
					))}
				</ul>

				<div className="popup_box_ft">
					{/* disabled={loading} — 요청 중에는 버튼 비활성화로 중복 요청 방지 */}
					<button type="button" className="btn btn_primary" onClick={handleSubmit} disabled={loading}>신고</button>
					<button type="button" className="btn btn_cancel" onClick={onClose}>취소</button>
				</div>
			</div>
		</>
	);
}

export default ReportModal;
