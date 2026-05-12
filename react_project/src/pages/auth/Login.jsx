import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
import { setCurrentUser } from '../../utils/authStorage';
// TODO: MdPerson, MdLock import 추가 (react-icons/md)
import { MdPerson, MdLock } from 'react-icons/md';

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

		try {
			const res = await authApi.login({ userId: id, password });
			setCurrentUser(res.data);
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
						{/* TODO: input_icon_wrap div로 감싸고, MdPerson 아이콘을 input 앞에 추가 */}
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
						{/* TODO: input_icon_wrap div로 감싸고, MdLock 아이콘을 input 앞에 추가 */}
						<div className="input_icon_wrap">
							<MdLock className="input_icon" />
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
					</div>

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
