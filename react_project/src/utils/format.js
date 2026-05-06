// 날짜 포맷 (예: 2025.12.10 14:30)
export function formatDate(dateStr) {
	const date	= new Date(dateStr);
	const yyyy	= date.getFullYear();
	const mm		= String(date.getMonth() + 1).padStart(2, '0');
	const dd	 	= String(date.getDate()).padStart(2, '0');
	const hh	 	= String(date.getHours()).padStart(2, '0');
	const min		= String(date.getMinutes()).padStart(2, '0');
	return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

// 텍스트 말줄임 (지정 길이 초과 시 ... 처리)
export function truncate(str, length = 50) {
	if (!str) return '';
	return str.length > length ? str.slice(0, length) + '...' : str;
}
