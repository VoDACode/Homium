import React from "react";
import { ApiAuth } from "../../services/api/auth";
import { useNavigate } from "react-router-dom";
import cl from "./.module.css";
import Space from "../../components/Space/Space";
import LoadingAnimation from "../../components/LoadingAnimation/LoadingAnimation";

const AuthorizationPage = () => {

    const navigate = useNavigate();

    const [isAuthorizing, setIsAuthorizing] = React.useState(false);
    const [logInErr, setLogInErr] = React.useState(undefined);

    async function SignInRequest(username, password) {
        setIsAuthorizing(true);
        await ApiAuth.signIn(username, password).then(res => {
            if (res.ok) {
                navigate('/', { replace: true });
            }
            else {
                setLogInErr("authorization failed");
            }
        });
        setIsAuthorizing(false);
    }

    function RenderAuthError() {
        if (logInErr) {
            return (
                <>
                    <div className={cl.error}>
                        <div className={cl.error_text_area}>
                            <span className={cl.error_header}>Error:</span>
                            <span className={cl.error_text}>{logInErr}</span>
                        </div>
                        <div className={cl.error_close_area}>
                            <img className={cl.error_close_sign} onClick={() => setLogInErr(undefined)} />
                        </div>
                    </div>
                    <Space height="20px" />
                </>
            );
        }

        return null;
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, []);

    return (
        <div className={cl.background}>
            <div className={cl.main}>
                <h1 className={cl.page_header}>Sign in to Homium</h1>
                <Space height="30px" />
                {RenderAuthError()}
                <form className={cl.log_in_panel}>
                    <div className={cl.username_cont}>
                        <img className={cl.user_img} alt="user" />
                        <input className={cl.user} type="text" placeholder="Username" />
                    </div>
                    <Space height="20px" />
                    <div className={cl.password_cont}>
                        <img className={cl.password_img} alt="password" />
                        <input className={cl.password} type="password" placeholder="Password" />
                    </div>
                    <Space height="30px" />
                    <div className={cl.exec} onClick={() => SignInRequest(
                        document.getElementsByClassName(cl.user)[0].value,
                        document.getElementsByClassName(cl.password)[0].value
                    )}>
                        {
                            isAuthorizing ?
                                <>
                                    <LoadingAnimation size="30px" loadingCurveWidth="8px" isCenter={true} />
                                    <Space height="20px" />
                                </> :
                                <p className={cl.exec_text}>Sign in</p>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthorizationPage;