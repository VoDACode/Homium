import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';

const LogInInput = () => {
    const navigate = useNavigate();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();

    function SignInRequest(username, password) {
        fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: username, password: password})
        }).then(res => {
            if (res.ok) {
                navigate('/');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <div className={cl.main}>
            <input className={cl.user} type="text" placeholder="Username *" ref={usernameInputRef}/>
            <VertSpace h={3} unit="vh"/>
            <input className={cl.password} type="password" placeholder="Password *" ref={passwordInputRef}/>
            <VertSpace h={5} unit="vh"/>
            <button className={cl.exec} onClick={() => SignInRequest(usernameInputRef.current.value, passwordInputRef.current.value)}>Sign in</button>
        </div>
    );
}

export default LogInInput;