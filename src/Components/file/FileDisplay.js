import React from 'react';
import "../../css/fileDisplay.css"; // 추가: 스타일 파일 import

const FileDisplay = (props) => {
  const boardId = props.boardId;
  const files = props.files

  if (!files || files.length === 0) {
    return (
      <div className='file-box'>
        <p>No files</p>
      </div>
    );
  }

  return (
    <div className='file-box'>
      <ul>
        {files.map((file) => (
          <li key={file.fileId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {/* 파일 다운로드 버튼 */}
              [<a href={`http://localhost:8989/board/${boardId}/file/download?fileId=${file.fileId}`} download>Download</a>] &nbsp;
              <strong>File Name:</strong> &nbsp;
                {file.originFileName}
              
              
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileDisplay;
