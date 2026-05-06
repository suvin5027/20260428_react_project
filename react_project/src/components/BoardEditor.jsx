import { useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

// props: value(초기 내용), onChange(내용 바뀔 때 실행할 함수)
function BoardEditor({ value, onChange }) {
	// 숨겨진 file input을 버튼 클릭으로 열기 위한 ref
	const fileInputRef = useRef(null);

	const editor = useEditor({
		extensions: [StarterKit, Image],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	// 이미지 파일 선택 시 실행
	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// 임시: 브라우저 메모리에 올려서 미리보기 URL 생성 (새로고침하면 사라짐)
		// TODO API 연동 시 교체:
		/*
		const formData = new FormData();
		formData.append('image', file);
		const res = await boardApi.uploadImage(formData);	// POST /boards/image
		const url = res.data.url;
		*/
		const url = URL.createObjectURL(file);

		editor.chain().focus().setImage({ src: url }).run();

		// 같은 파일 재선택 가능하도록 초기화
		e.target.value = '';
	};

	return (
		<div className="board_editor">
			{/* 툴바 */}
			<div className="board_editor_toolbar">
				<button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? '_on' : ''}>B</button>
				<button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? '_on' : ''}>I</button>
				<button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? '_on' : ''}>S</button>
				<span className="toolbar_divider" />
				<button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? '_on' : ''}>• 목록</button>
				<button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? '_on' : ''}>1. 목록</button>
				<span className="toolbar_divider" />
				{/* 이미지 버튼 — 클릭하면 숨겨진 file input 열림 */}
				<button type="button" onClick={() => fileInputRef.current.click()}>이미지</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					style={{ display: 'none' }}
					onChange={handleImageUpload}
				/>
			</div>
			{/* 에디터 본문 영역 */}
			<EditorContent editor={editor} />
		</div>
	);
}

export default BoardEditor;
