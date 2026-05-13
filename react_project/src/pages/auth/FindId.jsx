import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';

function FindId() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [foundId, setFoundId] = useState(null); // null이면 결과 미표시, 값 있으면 결과 표시
	const [error, setError] = useState('');

	// 이름+이메일로 아이디 조회 — 성공 시 foundId에 저장, 실패 시 에러 메시지
	const handleSubmit = async (e) => {
		e.preventDefault(); // form 기본 동작(새로고침) 방지
		if (!name || !email) return setError("입력된 값이 없습니다.");

		try {
			const res = await authApi.findId({ userName: name, email });
			setFoundId(res.data);
		} catch {
			setError('일치하는 계정이 없습니다.');
		}
	};

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">아이디 찾기</h2>

				{/* foundId가 null일 때만 폼 표시 — 결과가 나오면 폼 숨김 */}
				{foundId === null && (
					<form onSubmit={handleSubmit}>
						<div className="login_field">
							<label htmlFor="name">이름</label>
							<input
								id="name"
								type="text"
								className="input_text"
								placeholder="이름을 입력하세요."
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="login_field">
							<label htmlFor="email">이메일</label>
							<input
								id="email"
								type="email"
								className="input_text"
								placeholder="이메일을 입력하세요."
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						{error && <p className="form_error">{error}</p>}
						<button type="submit" className="btn btn_primary">확인</button>
					</form>
				)}

				{/* foundId가 있을 때 결과 표시 */}
				{foundId && (
					<div className="login_find_result">
						<p>회원님의 아이디는 <strong>{foundId}</strong> 입니다.</p>
					</div>
				)}

				<div className="login_register">
					<Link to="/login">로그인으로 돌아가기</Link>
				</div>
			</div>
		</div>
	);
}

export default FindId;
