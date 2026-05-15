import { useState, useEffect } from 'react';
import reportApi from '../../api/reportApi';
import Pagination from '../../components/Pagination';
import { PAGE_SIZE } from '../../constants';

const REASON_LABEL = {
	ABUSE:   '욕설/혐오',
	SPAM:    '스팸/광고',
	OBSCENE: '음란물',
	ETC:     '기타',
};

const STATUS_LABEL = {
	PENDING:   '미처리',
	PROCESSED: '처리완료',
};

function AdminReportList() {
	const [reports, setReports] = useState([]);
	const [status, setStatus] = useState(''); // '' = 전체
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		setCurrentPage(1);
		fetchReports();
	}, [status]);

	const fetchReports = async () => {
		try {
			const res = await reportApi.getReports({ status });
			setReports(res.data);
		} catch (e) {
			console.error(e);
		}
	};

	// 신고 처리 상태 토글 (PENDING ↔ PROCESSED)
	const handleStatusToggle = async (report) => {
		const next = report.status === 'PENDING' ? 'PROCESSED' : 'PENDING';
		await reportApi.updateStatus(report.reportSeq, next);
		fetchReports();
	};

	const totalPages = Math.ceil(reports.length / PAGE_SIZE);
	const currentList = reports.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="admin_section">
			<h3 className="admin_section_title">
				<span>신고 관리</span>
				<span className="admin_total">총 {reports.length}건</span>
			</h3>

			{/* 처리 상태 탭 필터 */}
			<section className="tab_wrap">
				<ul className="tab_list" role="tablist">
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${status === '' ? ' _active' : ''}`} onClick={() => setStatus('')}>전체</button>
					</li>
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${status === 'PENDING' ? ' _active' : ''}`} onClick={() => setStatus('PENDING')}>미처리</button>
					</li>
					<li className="tab_item">
						<button type="button" role="tab" className={`tab_btn${status === 'PROCESSED' ? ' _active' : ''}`} onClick={() => setStatus('PROCESSED')}>처리완료</button>
					</li>
				</ul>
			</section>

			<table className="table admin_table">
				<caption>신고 관리 테이블</caption>
				<colgroup>
					<col style={{width: '55px'}} />
					<col style={{width: '75px'}} />
					<col />
					<col style={{width: '75px'}} />
					<col style={{width: '90px'}} />
					<col style={{width: '130px'}} />
					<col style={{width: '80px'}} />
				</colgroup>
				<thead>
					<tr>
						<th scope="col">번호</th>
						<th scope="col">구분</th>
						<th scope="col">대상 내용</th>
						<th scope="col">사유</th>
						<th scope="col">신고자</th>
						<th scope="col">신고일</th>
						<th scope="col">상태</th>
					</tr>
				</thead>
				<tbody>
					{currentList.length === 0 ? (
						<tr>
							<td colSpan="7" className="admin_empty">신고 내역이 없습니다.</td>
						</tr>
					) : (
						currentList.map((report) => (
							<tr key={report.reportSeq}>
								<td>{report.reportSeq}</td>
								<td>{report.targetType === 'BOARD' ? '게시글' : '댓글'}</td>
								<td className="text_left">{report.targetTitle}</td>
								<td>{REASON_LABEL[report.reason] ?? report.reason}</td>
								<td>{report.reporterNickname}</td>
								<td>{report.createdAt}</td>
								<td>
									{/* 클릭 시 PENDING ↔ PROCESSED 토글 */}
									<button
										type="button"
										className={`btn ${report.status === 'PENDING' ? 'btn_del' : 'btn_cancel'}`}
										onClick={() => handleStatusToggle(report)}
									>
										{STATUS_LABEL[report.status]}
									</button>
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>

			{totalPages > 1 && (
				<div className="admin_list_bottom">
					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</div>
			)}
		</div>
	);
}

export default AdminReportList;
