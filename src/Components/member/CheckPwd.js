import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import MemberUpdate from "./MemberUpdate";

function CheckPwd() {
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [showMemberUpdate, setShowMemberUpdate] = useState(false);

    const changeEmail = (event) => {
        setEmail(event.target.value);
    }

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changePwd = (event) => {
        setPwd(event.target.value);
    }

    useEffect(() => {
        // 컴포넌트가 렌더링될 때마다 localStorage의 토큰 값으로 headers를 업데이트
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
        });
      }, []);

    const passwordCheck = async () => {
        const req = {
            password: pwd
        }

        try {
            const resp = await axios.post("http://localhost:8989/user/checkPwd", req, { headers: headers });
            console.log("[MemberUpdate.js] checkPwd() success :D");
            console.log(resp.data);
            setEmail(resp.data.email);
            setName(resp.data.username);

            setShowMemberUpdate(true);
        } catch (err) {
            console.log("[MemberUpdate.js] checkPwd() error :<");
            console.log(err);

            const resp = err.response;
            if (resp.status === 400) {
                alert(resp.data);
            }
        }
    }

    return (
        <div>
            {showMemberUpdate ? (
                <MemberUpdate email={email} name={name} />
            ) : (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>비밀번호</th>
                                <td>
                                    <input type="password" value={pwd} onChange={changePwd} size="50px" />
                                </td>
                            </tr>
                        </tbody>
                    </table><br />

                    <div className="my-3 d-flex justify-content-center">
                        <button className="btn btn-outline-secondary" onClick={passwordCheck}>
                            <i className="fas fa-user-plus"></i>비밀번호 확인
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CheckPwd;