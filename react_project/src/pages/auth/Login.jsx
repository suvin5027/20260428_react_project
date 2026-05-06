import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../utils/authStorage';

function Login() {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState({ id: '' });

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!id.trim() || !password.trim()) {
			setErrors({ id: '아이디와 비밀번호를 입력해주세요.' });
			return;
		}

		/*
		API 연동 시 교체:
		const res = await authApi.login({ id, password });	// POST /auth/login
		const result = res.data;
		if (result.success) {
			localStorage.setItem('token', result.token);	// JWT 토큰 저장
		}
		*/
		const result = login({ id, password });

		if (result.success) {
			navigate('/board');
		} else {
			setErrors({ id: result.message });
		}
	};

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">로그인</h2>

				<form onSubmit={handleSubmit}>
					<div className="login_field">
						<label htmlFor="id">아이디</label>
						<input
							id="id"
							type="text"
							className="input_text"
							placeholder="아이디를 입력하세요."
							value={id}
							onChange={(e) => setId(e.target.value)}
						/>
					</div>

					<div className="login_field">
						<label htmlFor="password">비밀번호</label>
						<input
							id="password"
							type="password"
							className="input_text"
							placeholder="비밀번호를 입력하세요."
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{errors.id && <p className="form_error">{errors.id}</p>}

					<button type="submit" className="btn btn_primary">로그인</button>
				</form>

				<div className="login_register">
					<span>계정이 없으신가요?</span>
					<Link to="/register">회원가입</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
