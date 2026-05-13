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

// 로그인 시각 포맷 (timestamp → YYYY/MM/DD HH:mm:SS)
export function formatLoginTime(timestamp) {
	const date = new Date(timestamp);
	const yyyy = date.getFullYear();
	const mm   = String(date.getMonth() + 1).padStart(2, '0');
	const dd   = String(date.getDate()).padStart(2, '0');
	const hh   = String(date.getHours()).padStart(2, '0');
	const min  = String(date.getMinutes()).padStart(2, '0');
	const ss   = String(date.getSeconds()).padStart(2, '0');
	return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
}

// 조회수 포맷 (9,999 이하는 콤마 표시, 10,000 이상은 9,999+)
export function formatViewCount(count) {
	if (count > 9999) return '9,999+';
	return count.toLocaleString();
}

// 텍스트 말줄임 (지정 길이 초과 시 ... 처리)
export function truncate(str, length = 50) {
	if (!str) return '';
	return str.length > length ? str.slice(0, length) + '...' : str;
}
