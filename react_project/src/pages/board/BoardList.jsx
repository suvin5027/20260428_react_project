// 외부 라이브러리
import { useState } from 'react';
import { Link } from 'react-router-dom';

// 유틸/상수
import { PAGE_SIZE, CATEGORY_LABEL } from '../../constants';

// 내부 컴포넌트
import Pagination from '../../components/Pagination';

const BOARD_LIST = [
	{ id: 1, category: 'notice', title: 'AR 원격 협업 이용에 대한 안내 ★', author: '관리자', date: '2025.12.10 14:30' },
	{ id: 2, category: 'notice', title: 'AR 원격 협업 지식블로그 관련 공지', author: '관리자', date: '2025.12.15 14:30' },
	{ id: 3, category: 'notice', title: '공지사항 내용이 여기에 보여집니다.', author: '관리자', date: '2025.12.12 14:30' },
	{ id: 4, category: 'general', title: 'The Nagasaki is the trademarked name of several series of Nagasaki sport bikes, that started with the 198—', author: '맹구', date: '2025.12.10 14:30' },
	{ id: 5, category: 'general', title: 'The Football Is Good For Training And Recreational Purposes.', author: '김철수', date: '2025.12.10 14:30' },
	{ id: 6, category: 'general', title: 'New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart', author: '유리', date: '2025.12.09 14:30' },
	{ id: 7, category: 'general', title: 'The beautiful range of Apple Naturale that has an exciting mix of natural ingredients. With the Goodness of 100%—', author: '훈이', date: '2025.12.08 14:30' },
	{ id: 8, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur. Viverra amet convallis dolor proin gravida ut nam in.', author: '신짱구', date: '2025.12.08 14:30' },
	{ id: 9, category: 'general', title: '공지사항 내용이 여기에 보여집니다. Lorem ipsum dolor sit amet consectetur. Pellentesque nulla varius lacinia lorem—', author: '신짱구', date: '2025.12.04 14:30' },
	{ id: 10, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et est provident unde incidunt fugiat nihil consequuntur dicta id molestiae dignissimos, quod rerum eum error accusamus aperiam dolor nesciunt quis dolorem recusandae reiciendis pariatur similique consequatur corporis dolorum? Iure, totam officia. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis. Exercitationem, laudantium tenetur aliquid possimus harum velit eligendi assumenda autem nemo aspernatur voluptates esse quae, sunt cumque numquam quos ducimus explicabo molestiae aperiam illum. Inventore hic eveniet, explicabo modi consequatur architecto eligendi veniam laudantium. Maiores ipsam libero incidunt numquam suscipit itaque perferendis, molestiae hic?', author: '신짱구', date: '2025.12.01 14:30' },
	{ id: 11, category: 'general', title: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Et est provident unde incidunt fugiat nihil consequuntur dicta id molestiae dignissimos, quod rerum eum error accusamus aperiam dolor nesciunt quis dolorem recusandae reiciendis pariatur similique consequatur corporis dolorum? Iure, totam officia. Cupiditate nulla iusto nisi nobis, voluptates explicabo labore dolorum aliquam enim voluptatum, expedita itaque illo perspiciatis. Exercitationem, laudantium tenetur aliquid possimus harum velit eligendi assumenda autem nemo aspernatur voluptates esse quae, sunt cumque numquam quos ducimus explicabo molestiae aperiam illum. Inventore hic eveniet, explicabo modi consequatur architecto eligendi veniam laudantium. Maiores ipsam libero incidunt numquam suscipit itaque perferendis, molestiae hic?', author: '신짱구', date: '2025.12.01 14:30' },
]

function BoardList() {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.ceil(BOARD_LIST.length / PAGE_SIZE);

	// 현재 페이지에 맞게 잘라내기
	const currentList = BOARD_LIST.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

	return (
		<div className="board_container board_list_container">
			<div className="board_hd_wrap">
				<h3 className="board_title">게시판</h3>
				<Link to="/board/write" className="btn btn_add">글쓰기</Link>
			</div>

			{/* 게시판 리스트 */}
			<ul className="board_wrap">
				{currentList.map((item) => (
					<li key={item.id} className='board_item'>
						<Link to={`/board/${item.id}`} className='board_link' title={item.title}>
							{/* CATEGORY_LABEL 객체로 코드값(notice/general) → 한글 텍스트 변환, _${category}로 클래스 분기 */}
							<span className={`board_info__label _${item.category}`}>{CATEGORY_LABEL[item.category]}</span>
							<span className='board_info__title'>{item.title}</span>
							<div className='board_info'>
								<span className='board_info__date'>{item.date}</span>
							</div>
						</Link>
					</li>
				))}
			</ul>

			{/* 페이지네이션 */}
			<div className="board_ft_wrap">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
}

export default BoardList;
