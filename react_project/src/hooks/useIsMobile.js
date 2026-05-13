import { useState, useEffect } from 'react';

// 커스텀 훅 — "use"로 시작하는 일반 함수야. React 훅(useState 등)을 쓸 수 있다는 약속.
// breakpoint: 기준 너비(px), 기본값 768. 호출 시 다른 값을 넣으면 그 값으로 판단.
// 예) useIsMobile()      → 768px 기준
//     useIsMobile(1280)  → 1280px 기준
export function useIsMobile(breakpoint = 1280) {

	// 초기값을 () => 함수 형태로 넘기면 컴포넌트가 처음 렌더링될 때 딱 한 번만 실행돼.
	// window.matchMedia()는 CSS @media 쿼리랑 문법이 동일한 JS API야.
	// .matches는 현재 화면이 조건에 맞으면 true, 아니면 false를 반환하는 속성(property).
	const [isMobile, setIsMobile] = useState(
		() => window.matchMedia(`(max-width: ${breakpoint}px)`).matches
	);

	// breakpoint가 바뀔 때마다 이 effect가 다시 실행돼 → 의존성 배열에 breakpoint 포함.
	useEffect(() => {
		// mql(MediaQueryList): 미디어 쿼리 조건을 감시하는 객체.
		// useState 초기값과 같은 조건을 걸어줘야 일관성이 유지돼.
		const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);

		// 창 크기가 바뀔 때마다 브라우저가 handler를 호출해줘.
		// 이벤트 객체(e)의 .matches로 조건이 맞는지 알 수 있어 — e.matches() 가 아니라 e.matches (속성이야!).
		const handler = (e) => setIsMobile(e.matches);

		// 'change' 이벤트: breakpoint 경계를 넘을 때 발생 (모바일↔데스크탑 전환 시점).
		mql.addEventListener('change', handler);

		// cleanup 함수: 컴포넌트가 사라질 때 React가 자동으로 실행해줘.
		// 이벤트 리스너를 제거하지 않으면 컴포넌트가 사라져도 계속 메모리에 남아 누수가 생겨.
		// return 값이 "나중에 실행할 함수"여야 해서 () => 로 감싸서 반환하는 거야.
		return () => mql.removeEventListener('change', handler);

	}, [breakpoint]);

	// true면 모바일, false면 데스크탑 — 이 훅을 쓰는 컴포넌트에서 분기에 활용.
	return isMobile;
}
