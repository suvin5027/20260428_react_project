import { useState } from 'react';
import { Link } from 'react-router-dom';
import authApi from '../../api/authApi';

function FindId() {
	// TODO: name state 추가 (이름 입력값)
	// TODO: email state 추가 (이메일 입력값)
	// TODO: foundId state 추가 (찾은 아이디 — null이면 결과 미표시)
	// TODO: error state 추가 (에러 메시지)

	// TODO: handleSubmit async 함수
	//   - name, email 둘 다 비어있으면 error 세팅 후 return
	//   - authApi.findId({ userName: name, email }) 호출
	//   - 성공 시 setFoundId(res.data)
	//   - 실패(404) 시 setError('일치하는 계정이 없습니다.')

	return (
		<div className="login">
			<div className="login_box">
				<h2 className="login_title">아이디 찾기</h2>

				{/* 결과가 없을 때만 폼 표시 */}
				{/* TODO: foundId가 null일 때만 아래 form 렌더링 */}
				<form onSubmit={/* TODO: handleSubmit 연결 */ undefined}>
					<div className="login_field">
						<label htmlFor="name">이름</label>
						{/* TODO: input — value, onChange 연결 */}
						<input
							id="name"
							type="text"
							className="input_text"
							placeholder="이름을 입력하세요."
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

				{/* TODO: foundId가 있을 때 결과 표시 */}
				{/* 예시 구조:
				<div className="login_find_result">
					<p>회원님의 아이디는 <strong>{foundId}</strong> 입니다.</p>
					<Link to="/login" className="btn btn_primary">로그인하기</Link>
				</div>
				*/}

				<div className="login_register">
					<Link to="/login">로그인으로 돌아가기</Link>
				</div>
			</div>
		</div>
	);
}

export default FindId;
