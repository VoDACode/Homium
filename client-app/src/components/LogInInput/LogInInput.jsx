import React from "react";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';
import emailPng from './email.png';
import passwordPng from './password.png';

const LogInInput = () => {
    return (
        <div className={cl.main}>
            <input className={cl.email} type="text" placeholder="Email"/>
            <VertSpace h={5} unit="vh"/>
            <input className={cl.password} type="text" placeholder="Password"/>
        </div>
    );
}

export default LogInInput;