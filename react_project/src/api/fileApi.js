import instance from './instance';

const fileApi = {
	// 파일 업로드 (FormData로 전송)
	upload: (boardSeq, files) => {
		const formData = new FormData();
		files.forEach((file) => formData.append('files', file));
		return instance.post(`/api/files?boardSeq=${boardSeq}`, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},
	getFiles: (boardSeq) => instance.get(`/api/files/${boardSeq}`),
	download: (fileSeq) => instance.get(`/api/files/download/${fileSeq}`, { responseType: 'blob' }),
	delete: (fileSeq) => instance.delete(`/api/files/${fileSeq}`),
};

export default fileApi;
