import React , { useRef } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination";
import Comment from "./Comment.js"
import "../../css/commentList.css"; // 스타일 파일 import

function CommentList(props) {

	const boardId = props.boardId;

	// Paging
	const [page, setPage] = useState(1);
	const [totalCnt, setTotalCnt] = useState(0);
	const [commentList, setCommentList] = useState([]);

	// comment에서 참조
	const getCommentListRef  = useRef(null);

	const changePage = (page) => {
		setPage(page);
		getCommentList(page);
		getCommentListRef.current(page);
	}

	const getCommentList = async (page) => {
		await axios.get(`http://localhost:8989/board/${boardId}/comment/list`, { params: {"page": page - 1} })
			.then((resp) => {
				console.log("[BbsComment.js] getCommentList() success :D");
				console.log(resp.data);
				
				setCommentList(resp.data.content);
				setTotalCnt(resp.data.totalElements);

			}).catch((err) => {
				console.log("[BbsComment.js] getCommentList() error :<");
				console.log(err);

			});
	}

	useEffect(() => {
		getCommentListRef.current = getCommentList;
		getCommentList(1);
	}, [boardId]);

	return (
		<>
			<div className="my-1 d-flex justify-content-center">
			</div>

			<Pagination
				activePage={page}
				itemsCountPerPage={5}
				totalItemsCount={totalCnt}
				pageRangeDisplayed={5}
				prevPageText={"‹"}
				nextPageText={"›"}
				onChange={changePage} />
			{
				commentList.map(function (comment, idx) {
					return (
						<div className="my-5" key={idx}>
							<Comment obj={comment} key={idx} page={page} getCommentList={getCommentListRef.current}/>
						</div>
					);
				})
			}

		</>

	);
}


export default CommentList;