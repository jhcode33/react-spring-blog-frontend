import axios from "axios";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function CommentWrite(props) {
	const { headers, setHeaders } = useContext(HttpHeadersContext);
	const { boardId } = useParams(); // 파라미터 가져오기

	const id = localStorage.getItem("id");

	const [content, setContent] = useState("");
	const navigate = useNavigate();

	const chageContent = (event) => {
		setContent(event.target.value);
	}

	const createComment = async() => {

		const req = {
			content: content,
		}

		await axios.post(`http://localhost:8989/board/${boardId}/comment/write`, req, {headers: headers})
		.then((resp) => {
			console.log("[CommentWrite.js] createComment() success :D");
			console.log(resp.data);
			alert("댓글을 성공적으로 등록했습니다 :D");
			navigate(0);

		}).catch((err) => {
			console.log("[CommentWrite.js] createComment() error :<");
			console.log(err);

		});
	}

	return (
		<>
				{/* 상단 영역 (프로필 이미지, 댓글 작성자) */}
				<div className="my-1 d-flex justify-content-center">
					<div className="col-1">
						<img src="/images/profile-placeholder.png" alt="프로필 이미지"
							className="profile-img"/>
					</div>

					<div className="col-7">
						<span className="comment-id" >{id}</span>
					</div>
					<div className="col-2 my-1 d-flex justify-content-end">
						<button className="btn btn-outline-secondary" onClick={createComment}><i className="fas fa-comment-dots"></i> 댓글 추가</button>
					</div>
				</div>
				{/* 하단 영역 (댓글 내용) */}
				<div className="my-3 d-flex justify-content-center">
					<textarea className="col-10" rows="1" value={content} onChange={chageContent}></textarea>
				</div><br/><br/>
		</>
	)
}

export default CommentWrite;