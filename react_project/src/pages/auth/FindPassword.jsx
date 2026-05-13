import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { MdVisibilityOff, MdVisibility } from 'react-icons/md';

function FindPassword() {
	const navigate = useNavigate();

	// step: 'verify'(아이디+이메일 입력) → 'reset'(새 비밀번호 입력) 순서로 진행
	const [step, setStep] = useState('verify');
	const [userId, setUserId] = useState('');
	const [email, setEmail] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// 1단계 — 입력값 검증 후 reset 단계로 전환
	// API 호출을 하지 않는 이유: 아이디+이메일 조합이 존재하는지 여기서 확인하지 않고,
	// 2단계 resetPassword 호출 시 서버가 404를 돌려주면 그때 에러 처리함
	const handleVerify = (e) => {
		e.preventDefault();
		if (!userId || !email) return setError('입력된 값이 없습니다.');
		setStep('reset');
	};

	// 2단계 — 비밀번호 일치 확인 후 변경 API 호출
	// 아이디+이메일 조합이 DB에 없으면 서버가 404 → catch에서 에러 표시
	const handleReset = async (e) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) return setError('비밀번호가 맞지 않습니다.');

		try {
			await authApi.resetPassword({ userId, email, password: newPassword });
			navigate('/login');
		} catch {
			setError('일치하는 계정이 없습니다.');
		}
	};

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">비밀번호 찾기</h2>

				{/* 1단계 — 아이디 + 이메일 입력 */}
				{step === 'verify' && (
					<form onSubmit={handleVerify}>
						<div className="login_field">
							<label htmlFor="userId">아이디</label>
							<input
								id="userId"
								type="text"
								className="input_text"
								placeholder="아이디를 입력하세요."
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
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

				{/* 2단계 — 새 비밀번호 입력 */}
				{step === 'reset' && (
					<form onSubmit={handleReset}>
						<div className="login_field">
							<label htmlFor="newPassword">새 비밀번호</label>
							<div className="input_form_group">
								{/* showPassword로 text/password 타입 토글 */}
								<input
									id="newPassword"
									type={showPassword ? 'text' : 'password'}
									className="input_text"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
								/>
								<button type="button" className="btn_visible" onClick={() => setShowPassword(!showPassword)}>
									{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
								</button>
							</div>
						</div>
						<div className="login_field">
							<label htmlFor="confirmPassword">비밀번호 확인</label>
							<div className="input_form_group">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									className="input_text"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<button type="button" className="btn_visible" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
									{showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
								</button>
							</div>
						</div>
						{error && <p className="form_error">{error}</p>}
						<button type="submit" className="btn btn_primary">변경하기</button>
					</form>
				)}

				<div className="login_register">
					<Link to="/login">로그인으로 돌아가기</Link>
				</div>
			</div>
		</div>
	);
}

export default FindPassword;
