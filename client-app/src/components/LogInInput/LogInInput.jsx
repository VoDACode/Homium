import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';
import { ApiAuth } from "../../services/api/auth";

const LogInInput = () => {
    const navigate = useNavigate();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();

    function SignInRequest(username, password) {
        ApiAuth.signIn(username, password).then(res => {
            if (res.ok) {
                navigate('/');
            }
        });
    }

    return (
        <div className={cl.main}>
            <input className={cl.user} type="text" placeholder="Username *" ref={usernameInputRef}/>
            <VertSpace height="3vh"/>
            <input className={cl.password} type="password" placeholder="Password *" ref={passwordInputRef}/>
            <VertSpace height="5vh"/>
            <button className={cl.exec} onClick={() => SignInRequest(usernameInputRef.current.value, passwordInputRef.current.value)}>Sign in</button>
        </div>
    );
}

export default LogInInput;