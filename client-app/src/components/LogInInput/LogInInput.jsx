import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Space from "../Space/Space";
import cl from './.module.css';
import { ApiAuth } from "../../services/api/auth";

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
            <input className={cl.user} type="text" placeholder="Username *" ref={usernameInputRef}/>
            <Space size="3vh"/>
            <input className={cl.password} type="password" placeholder="Password *" ref={passwordInputRef}/>
            <Space size="5vh"/>
            <button className={cl.exec} onClick={() => SignInRequest(usernameInputRef.current.value, passwordInputRef.current.value)}>Sign in</button>
        </div>
    );
}

export default LogInInput;