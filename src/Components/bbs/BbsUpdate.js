import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import FileManager from "../file/FileManager";

function BbsUpdate() {
	const { headers, setHeaders } = useContext(HttpHeadersContext);
	const { auth, setAuth } = useContext(AuthContext);
	const navigate = useNavigate();

	const location = useLocation();
	const { bbs } = location.state;
	
	const boardId = bbs.boardId;
	const [title, setTitle] = useState(bbs.title);
	const [content, setContent] = useState(bbs.content);
	const [files, setFile] = useState([]);
  	const [updatedFilesArray, setUpdatedFilesArray] = useState(bbs.files || []);

	const changeTitle = (event) => {
		setTitle(event.target.value);
	}

	const changeContent = (event) => {
		setContent(event.target.value);
	}

	const handleChangeFile = (event) => {
		setFile(event.target.files);
	}

    const handleChangeUpdatedFilesArray = (updatedFiles) => {
		setUpdatedFilesArray([...updatedFiles])
	}

	useEffect(() => {
		setFile([...updatedFilesArray]);
	}, [updatedFilesArray]);

	/* 파일 업로드 */
	const fileUpload = async (boardId) => {
        // 파일 데이터 저장
		const fd = new FormData();
		Object.values(files).forEach((file) => fd.append("file", file));

		await axios.post(`http://localhost:8989/board/${boardId}/file/upload`, fd, {headers: headers})
		.then((resp) => {
			console.log("[file.js] fileUpload() success :D");
			console.log(resp.data);

			alert("파일 업로드 성공 :D");
			navigate(`/bbsdetail/${bbs.boardId}`); // 글 상세로 이동
		})
		.catch((err) => {
			console.log("[FileData.js] fileUpload() error :<");
			console.log(err);
		});
	}

	/* 파일 삭제 */
	const fileDelete = async (boardId, fileId) => {
		try {
		await axios.delete(`http://localhost:8989/board/${boardId}/file/delete?fileId=${fileId}`, {headers: headers});
		console.log("[FielManager.js] fileDelete() success :D");
	
		// 서버로부터 업데이트된 게시글 정보를 가져옴
		const updatedBbs = await axios.get(`http://localhost:8989/board/${boardId}`, { headers: headers });
		const updatedFilesArray = Array.isArray(updatedBbs.data.files) ? updatedBbs.data.files : [];
	
		console.log("Updated files array:", updatedFilesArray);
	
		alert("파일 삭제 성공 :D");
	
		// 업데이트된 파일 목록으로 상태를 업데이트
		handleChangeUpdatedFilesArray(updatedFilesArray);
		console.log(files);

		} catch (error) {
			console.error("[FielManager.js] fileDelete() error :<");
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

			if (boardId != null) {
				alert("게시글을 성공적으로 수정했습니다 :D");
				fileUpload(boardId);
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
					{updatedFilesArray.length > 0 ? (
						<div className='file-box'>
							<ul>
								{updatedFilesArray.map((file) => (
									<li key={file.fileId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span>
											<strong>File Name:</strong> {file.originFileName} &nbsp;
											{/* 파일 다운로드 버튼 */}
											<a href={`http://localhost:8989/board/${boardId}/file/download?fileId=${file.fileId}`} download>
												Download
											</a>
										</span>
										{/* 삭제 버튼을 가장 오른쪽에 배치하기 */}
										<button
											style={{ marginRight: '20px', cursor: 'pointer' }}
											onClick={() => fileDelete(boardId, file.fileId)}
										>
											삭제
										</button>
									</li>
								))}
							</ul>
						</div>
					) : (
						<div className='file-box'>
							<p>No files</p>
						</div>
					)}
					<div className='file-box'>
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