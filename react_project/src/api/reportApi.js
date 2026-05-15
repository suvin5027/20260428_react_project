import instance from './instance';

const reportApi = {
	// 신고 등록
	report: (data) => instance.post('/api/reports', data),
	// 신고 목록 조회 (관리자용, status 필터)
	getReports: (params) => instance.get('/api/admin/reports', { params }),
	// 신고 처리 상태 변경
	updateStatus: (reportSeq, status) => instance.put(`/api/admin/reports/${reportSeq}/status`, { status }),
};

export default reportApi;
