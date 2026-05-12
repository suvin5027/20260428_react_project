import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../api/authApi';
// TODO: MdVisibility, MdVisibilityOff import 추가 (react-icons/md)

function FindPassword() {
	// TODO: step state 추가 — 'verify'(본인확인) | 'reset'(새 비밀번호 입력) 두 단계로 나뉨
	//   초기값: 'verify'
	// TODO: userId state 추가 (아이디 입력값)
	// TODO: email state 추가 (이메일 입력값)
	// TODO: newPassword state 추가 (새 비밀번호)
	// TODO: confirmPassword state 추가 (비밀번호 확인)
	// TODO: error state 추가
	// TODO: showPassword state 추가 (새 비밀번호 눈 아이콘 토글)

	// TODO: handleVerify async 함수 (1단계 — 본인 확인)
	//   - userId, email 비어있으면 error 세팅 후 return
	//   - authApi.findId({ userName: userId, email }) 대신...
	//     사실 여기선 아이디+이메일 조합이 존재하는지 확인만 하면 돼
	//     → authApi.resetPassword({ userId, email, password: '_check_' }) 호출하면 안 됨
	//     → 별도 verify 없이 그냥 step을 'reset'으로 넘기고, resetPassword 호출 시 404면 에러 처리
	//     → 그냥 setStep('reset') 으로 넘기기
	// TODO: handleReset async 함수 (2단계 — 비밀번호 변경)
	//   - newPassword !== confirmPassword 이면 error 세팅 후 return
	//   - authApi.resetPassword({ userId, email, password: newPassword }) 호출
	//   - 성공 시 /login으로 navigate
	//   - 실패(404) 시 setError('일치하는 계정이 없습니다.')

	const navigate = useNavigate();

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">비밀번호 찾기</h2>

				{/* TODO: step === 'verify'일 때 본인 확인 폼 렌더링 */}
				<form onSubmit={/* TODO: handleVerify 연결 */ undefined}>
					<div className="login_field">
						<label htmlFor="userId">아이디</label>
						{/* TODO: input — value, onChange 연결 */}
						<input
							id="userId"
							type="text"
							className="input_text"
							placeholder="아이디를 입력하세요."
						/>
					</div>
					<div className="login_field">
						<label htmlFor="email">이메일</label>
						{/* TODO: input — value, onChange 연결 */}
						<input
							id="email"
							type="email"
							className="input_text"
							placeholder="이메일을 입력하세요."
						/>
					</div>
					{/* TODO: error 있으면 <p className="form_error"> 표시 */}
					<button type="submit" className="btn btn_primary">확인</button>
				</form>

				{/* TODO: step === 'reset'일 때 새 비밀번호 폼 렌더링 */}
				{/* 예시 구조:
				<form onSubmit={handleReset}>
					<div className="login_field">
						<label htmlFor="newPassword">새 비밀번호</label>
						<div className="input_form_group">
							<input id="newPassword" type={showPassword ? 'text' : 'password'} className="input_text" ... />
							<button type="button" className="btn_visible" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <MdVisibilityOff /> : <MdVisibility />}
							</button>
						</div>
					</div>
					<div className="login_field">
						<label htmlFor="confirmPassword">비밀번호 확인</label>
						<input id="confirmPassword" type="password" className="input_text" ... />
					</div>
					{error && <p className="form_error">{error}</p>}
					<button type="submit" className="btn btn_primary">변경하기</button>
				</form>
				*/}

				<div className="login_register">
					<Link to="/login">로그인으로 돌아가기</Link>
				</div>
			</div>
		</div>
	);
}

export default FindPassword;
