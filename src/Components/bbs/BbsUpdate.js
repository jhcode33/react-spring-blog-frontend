import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbsupdate.css";

function BbsUpdate() {
	const { headers, setHeaders } = useContext(HttpHeadersContext);
	const { auth, setAuth } = useContext(AuthContext);
	const navigate = useNavigate();

	const location = useLocation();
	const { bbs } = location.state;
	
	const boardId = bbs.boardId;
	const [title, setTitle] = useState(bbs.title);
	const [content, setContent] = useState(bbs.content);
	const [files, setFiles] = useState([]);
	const [severFiles, setSeverFiles ] = useState(bbs.files || []);

	const changeTitle = (event) => {
		setTitle(event.target.value);
	}

	const changeContent = (event) => {
		setContent(event.target.value);
	}

	const handleChangeFile = (event) => {
		// 총 5개까지만 허용
		const selectedFiles = Array.from(event.target.files).slice(0, 5);
		setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
	};

	const handleRemoveFile = (index) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	const handleRemoveSeverFile = (index, boardId, fileId) => {
		setSeverFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
		fileDelete(boardId, fileId);
	}

	useEffect(() => {
		setHeaders({
			"Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
		});
	}, []);
	

	/* 파일 업로드 */
	const fileUpload = async (boardId) => {
		console.log("업로드할 파일 목록:", files);
		// 파일 데이터 저장
		const fd = new FormData();
		files.forEach((file) => fd.append(`file`, file));

		await axios.post(`http://localhost:8989/board/${boardId}/file/upload`, fd, {headers: headers})
			.then((resp) => {
				console.log("[file.js] fileUpload() success :D");
				console.log(resp.data);
				alert("게시물과 파일을 성공적으로 수정했습니다. :D");
				
				// 새롭게 등록한 글 상세로 이동
				navigate(`/bbsdetail/${boardId}`); 
			})
			.catch((err) => {
				console.log("[FileData.js] fileUpload() error :<");
				console.log(err);
			});
	};

	/* 파일 삭제 */
	const fileDelete = async (boardId, fileId) => {
		try {
			await axios.delete(`http://localhost:8989/board/${boardId}/file/delete?fileId=${fileId}`, {headers: headers});
				console.log("[BbsUpdate.js] fileDelete() success :D");
				alert("파일 삭제 성공 :D");
		} catch (error) {
			console.error("[BbsUpdate.js] fileDelete() error :<");
			console.error(error);
		}
	};

	/* 게시판 수정 */
	const updateBbs = async () => {

		const req = {
			id: auth, 
			title: title, 
			content: content
		}

		await axios.patch(`http://localhost:8989/board/${bbs.boardId}/update`, req, {headers: headers})
		.then((resp) => {
			console.log("[BbsUpdate.js] updateBbs() success :D");
			console.log(resp.data);
			const boardId = resp.data.boardId;

			if (files.length > 0) {
				fileUpload(boardId);
			} else {
				alert("게시글을 성공적으로 수정했습니다 :D");
				navigate(`/bbsdetail/${resp.data.boardId}`); // 새롭게 등록한 글 상세로 이동
			}
		})
		.catch((err) => {
			console.log("[BbsUpdate.js] updateBbs() error :<");
			console.log(err);
		});

	}


	return (
		<div>
			<table className="table">
				<tbody>
					<tr>
						<th className="table-primary">작성자</th>
						<td>
							<input type="text" className="form-control"  value={bbs.writerName} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th className="table-primary">제목</th>
						<td>
							<input type="text" className="form-control" value={title} onChange={changeTitle} size="50px" />
						</td>
					</tr>

					<tr>
						<th className="table-primary">내용</th>
						<td>
							<textarea className="form-control" value={content} onChange={changeContent} rows="10" ></textarea>
						</td>
					</tr>
					<tr>
					<th className="table-primary">파일</th>
					<td>
					{severFiles.length > 0 || files.length > 0 ? (
						<div className='file-box'>
							<ul>
								{/* 기존의 파일 데이터, 삭제 로직 */}
								{severFiles.map((file, index) => (
									<li key={file.fileId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span>
											<strong>File Name:</strong> {file.originFileName} &nbsp;
											<button className="delete-button" type="button" onClick={() => handleRemoveSeverFile(index, boardId, file.fileId)}>
												x
											</button>
										</span>
									</li>
								))}
								{/* 새로운 파일을 저장할 때 */}
								{files.map((file, index) => (
									<li key={file.fileId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span>
										<strong>File Name:</strong> {file.name} &nbsp;
										<button className="delete-button" type="button" onClick={() => handleRemoveFile(index)}>
											x
										</button>
									</span>
								</li>
								))}
							</ul>
						</div>
					) : (
						<div className='file-box'>
							<p>No files</p>
						</div>
					)}
					<div className='file-select-box'>
							<input type='file' name='file' onChange={handleChangeFile} multiple="multiple" />
					</div>
					</td>
				</tr>
				</tbody>
			</table>

			<div className="my-3 d-flex justify-content-center">
				<button className="btn btn-dark" onClick={updateBbs}><i className="fas fa-pen"></i> 수정하기</button>
			</div>
		</div>
	);

}

export default BbsUpdate;