import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import CommentWrite from "../comment/CommentWrite";
import CommentList from "../comment/CommentList";
import { AuthContext } from "../context/AuthProvider";

function BbsDetail() {
  const { auth, setAuth } = useContext(AuthContext);
  const [bbs, setBbs] = useState({});
  const { boardId } = useParams(); // 파라미터 가져오기
  const navigate = useNavigate();

  const getBbsDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8989/board/${boardId}`);

      console.log("[BbsDetail.js] getBbsDetail() success :D");
      console.log(response.data);

      setBbs(response.data);
    } catch (error) {
      console.log("[BbsDetail.js] getBbsDetail() error :<");
      console.error(error);
    }
  };

  const deleteBbs = async () => {
    try {
      const response = await axios.delete(`http://localhost:8989/board/${boardId}/delete`);

      console.log("[BbsDetail.js] deleteBbs() success :D");
      console.log(response.data);

      if (response.data.deletedRecordCount === 1) {
        alert("게시글을 성공적으로 삭제했습니다 :D");
        navigate("/bbslist");
      }
    } catch (error) {
      console.log("[BbsDetail.js] deleteBbs() error :<");
      console.error(error);
    }
  };

  useEffect(() => {
    getBbsDetail();
  }, []);

  const updateBbs = {
    seq: bbs.seq,
    id: bbs.id,
    title: bbs.title,
    content: bbs.content,
  };

  const parentBbs = {
    id: bbs.id,
    title: bbs.title,
  };

	return (
		<div>

			<div className="my-3 d-flex justify-content-end">
				<Link className="btn btn-outline-secondary" to={{pathname: `/bbsanswer/${bbs.seq}` }} state={{ parentBbs: parentBbs }}><i className="fas fa-pen"></i> 답글쓰기</Link> &nbsp;

			{
				/* 자신이 작성한 게시글인 경우에만 수정 삭제 가능 */
				(localStorage.getItem("id") == bbs.id) ?
					<>
						<Link className="btn btn-outline-secondary"  to="/bbsupdate" state={{ bbs: updateBbs }}><i className="fas fa-edit"></i> 수정</Link> &nbsp;
						<button className="btn btn-outline-danger"  onClick={deleteBbs}><i className="fas fa-trash-alt"></i> 삭제</button>
					</>
				:
				null
			}

			</div>

			<table className="table table-striped">
			<tbody>
			<tr>
				<th className="col-3">작성자</th>
				<td>
				<span>{bbs.writerName}</span>
				</td>
			</tr>

			<tr>
				<th>제목</th>
				<td>
				<span>{bbs.title}</span>
				</td>
			</tr>

			<tr>
				<th>작성일</th>
				<td>
				<span>{bbs.createdDate}</span>
				</td>
			</tr>

			<tr>
				<th>조회수</th>
				<td>
				<span>{bbs.viewCount}</span>
				</td>
			</tr>

			<tr>
				<th>내용</th>
				<td>
				<div>{bbs.content}</div>
				</td>
			</tr>
			</tbody>
			</table>

			<div className="my-3 d-flex justify-content-center">
				<Link className="btn btn-outline-secondary" to="/bbslist"><i className="fas fa-list"></i> 글목록</Link>
			</div><br/><br/>
{/* 
			댓글 작성 컴포넌트
			{
				(auth) ? // 로그인한 사용자만 댓글 작성 가능
					<CommentWrite seq={seq}/>
				:
					null
			} */}
			

			{/* 댓글 리스트 컴포넌트 */}
			{/* <CommentList  seq={seq}/> */}

		</div>
	);
}

export default BbsDetail;