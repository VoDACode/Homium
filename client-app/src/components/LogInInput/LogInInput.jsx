import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Space from "../Space/Space";
import cl from './.module.css';
import { ApiAuth } from "../../services/api/auth";
import userPng from './img/user.png';
import passwordPng from './img/password.png';

const LogInInput = () => {
    const navigate = useNavigate();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();

    function SignInRequest(username, password) {
        ApiAuth.signIn(username, password).then(res => {
            if (res.ok) {
                navigate('/', {replace: true});
            }
        });
    }

    return (
        <div className={cl.main}>
            <div className={cl.username_cont}>
                <img className={cl.user_img} src={userPng} alt="user"/>
                <input className={cl.user} type="text" placeholder="Username *" ref={usernameInputRef}/>
            </div>
            <Space size="3vh"/>
            <div className={cl.password_cont}>
                <img className={cl.password_img} src={passwordPng} alt="password"/>
                <input className={cl.password} type="password" placeholder="Password *" ref={passwordInputRef}/>
            </div>
            <Space size="5vh"/>
            <button className={cl.exec} onClick={() => SignInRequest(usernameInputRef.current.value, passwordInputRef.current.value)}>Sign in</button>
        </div>
    );
}

export default LogInInput;