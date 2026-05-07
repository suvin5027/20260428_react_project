import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';

function Register() {
	const [name, setName] = useState('');
	const [id, setId] = useState('');
	const [nickname, setNickname] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errors, setErrors] = useState({ name: '', id: '', nickname: '', email: '', password: '', confirmPassword: '' });

	const navigate = useNavigate();

	const validate = () => {
		const newErrors = { name: '', id: '', nickname: '', email: '', password: '', confirmPassword: '' };
		if (!name.trim()) newErrors.name = '이름을 입력해주세요.';
		if (!id.trim()) newErrors.id = '아이디를 입력해주세요.';
		if (!nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
		if (!email.trim()) newErrors.email = '이메일을 입력해주세요.';
		if (!password.trim()) {
			newErrors.password = '비밀번호를 입력해주세요.';
		} else if (password.length < 4) {
			newErrors.password = '비밀번호는 4자 이상 입력해주세요.';
		}
		if (!confirmPassword.trim()) {
			newErrors.confirmPassword = '비밀번호를 확인해주세요.';
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
		}
		setErrors(newErrors);
		return !newErrors.name && !newErrors.id && !newErrors.nickname && !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		try {
			await authApi.register({ userId: id, userName: name, nickname, email, password });
			navigate('/login');
		} catch (err) {
			setErrors((prev) => ({ ...prev, id: '서버 오류가 발생했습니다.' }));
		}
	};

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">회원가입</h2>

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
						{errors.id && <p className="form_error">{errors.id}</p>}
					</div>

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
						{errors.name && <p className="form_error">{errors.name}</p>}
					</div>

					<div className="login_field">
						<label htmlFor="nickname">닉네임</label>
						<input
							id="nickname"
							type="text"
							className="input_text"
							placeholder="닉네임을 입력하세요."
							value={nickname}
							onChange={(e) => setNickname(e.target.value)}
						/>
						{errors.nickname && <p className="form_error">{errors.nickname}</p>}
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
						{errors.email && <p className="form_error">{errors.email}</p>}
					</div>

					<div className="login_field">
						<label htmlFor="password">비밀번호</label>
						<input
							id="password"
							type="password"
							className="input_text"
							placeholder="비밀번호 4자 이상 입력해주세요."
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errors.password && <p className="form_error">{errors.password}</p>}
					</div>

					<div className="login_field">
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input
							id="confirmPassword"
							type="password"
							className="input_text"
							placeholder="비밀번호를 한 번 더 입력하세요."
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
						{errors.confirmPassword && <p className="form_error">{errors.confirmPassword}</p>}
					</div>

					<button type="submit" className="btn btn_primary">가입하기</button>
				</form>

				<div className="login_register">
					<span>이미 계정이 있으신가요?</span>
					<Link to="/login">로그인</Link>
				</div>
			</div>
		</div>
	);
}

export default Register;
