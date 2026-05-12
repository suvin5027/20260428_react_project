import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { setCurrentUser } from '../../utils/authStorage';
import { MdPerson, MdLock, MdVisibilityOff, MdVisibility } from 'react-icons/md';

function Login() {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({ id: '' });
	const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김
	// 아이디/비밀번호 저장 체크 여부 — localStorage에 저장된 값 있으면 true로 초기화
	const [saveId, setSaveId] = useState(localStorage.getItem("savedId") !== null);
	const [savePassword, setSavePassword] = useState(localStorage.getItem("savedPassword") !== null);

	const navigate = useNavigate();

	// 마운트 시 저장된 아이디/비밀번호 자동 입력
	useEffect(() => {
		const savedId = localStorage.getItem("savedId");
		const savedPassword = localStorage.getItem("savedPassword");
		if(savedId) setId(savedId);
		if(savedPassword) setPassword(savedPassword);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!id.trim() || !password.trim()) {
			setErrors({ id: '아이디와 비밀번호를 입력해주세요.' });
			return;
		}

		try {
			const res = await authApi.login({ userId: id, password });
			setCurrentUser(res.data);
			// 체크 여부에 따라 localStorage에 저장 또는 삭제
			saveId
				? localStorage.setItem("savedId", id)
				: localStorage.removeItem("savedId");
			savePassword
				? localStorage.setItem("savedPassword", password)
				: localStorage.removeItem("savedPassword");
			navigate('/board');
		} catch (err) {
			if (err.response?.status === 401) {
				setErrors({ id: '아이디 또는 비밀번호가 올바르지 않습니다.' });
			} else {
				setErrors({ id: '서버 오류가 발생했습니다.' });
			}
		}
	};

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">로그인</h2>

				<form onSubmit={handleSubmit}>
					<div className="login_field">
						<label htmlFor="id">아이디</label>
						{/* 아이디 아이콘 + input */}
						<div className="input_icon_wrap">
							<MdPerson className="input_icon" />
							<input
								id="id"
								type="text"
								className="input_text"
								placeholder="아이디를 입력하세요."
								value={id}
								onChange={(e) => setId(e.target.value)}
							/>
						</div>
					</div>

					<div className="login_field">
						<label htmlFor="password">비밀번호</label>
						{/* 자물쇠 아이콘 + input + 눈 아이콘 토글 */}
						<div className="input_icon_wrap">
							<MdLock className="input_icon" />
							<input
								id="password"
								type={showPassword ? 'text' : 'password'}
								className="input_text"
								placeholder="비밀번호를 입력하세요."
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button type="button" className="btn_visible" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <MdVisibilityOff /> : <MdVisibility /> }
							</button>
						</div>
						{errors.id && <p className="form_error">{errors.id}</p>}
					</div>

					<button type="submit" className="btn btn_primary">로그인</button>
					{/* 아이디/비밀번호 저장 체크박스 */}
					<div className="login_remember">
						<label className="login_remember_item">
							<input type="checkbox" checked={saveId} onChange={(e) => setSaveId(e.target.checked)} />
							아이디 저장
						</label>
						<label className="login_remember_item">
							<input type="checkbox" checked={savePassword} onChange={(e) => setSavePassword(e.target.checked)} />
							비밀번호 저장
						</label>
					</div>
				</form>

				<div className="login_register">
					<span>계정이 없으신가요?</span>
					<Link to="/register">회원가입</Link>
				</div>
				<div className="login_find">
					<Link to="/find-id">아이디 찾기</Link>
					<span className="login_find_divider">|</span>
					<Link to="/find-password">비밀번호 찾기</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
