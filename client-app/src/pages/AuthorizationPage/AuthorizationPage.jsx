import React from "react";
import cl from "./.module.css";
import Space from "../../components/Space/Space";
import { ApiAuth } from "../../services/api/auth";
import { useNavigate } from "react-router-dom";

const AuthorizationPage = () => {

    const navigate = useNavigate();

    function SignInRequest(username, password) {
        ApiAuth.signIn(username, password).then(res => {
            if (res.ok) {
                navigate('/', { replace: true });
            }
        });
    }

    React.useEffect(() => {
        document.body.style.backgroundColor = 'white';
    }, []);

    return (
        <div className={cl.background}>
            <div className={cl.main}>
                <h1 className={cl.page_header}>Sign in to Homium</h1>
                <Space height="30px" />
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
                        <p className={cl.exec_text}>Sign in</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthorizationPage;