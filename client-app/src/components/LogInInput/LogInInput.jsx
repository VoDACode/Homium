import React from "react";
import VertSpace from "../VertSpace/VertSpace";
import cl from './.module.css';

const LogInInput = () => {
    return (
        <div className={cl.main}>
            <input className={cl.user} type="text" placeholder="Username *"/>
            <VertSpace h={3} unit="vh"/>
            <input className={cl.password} type="password" placeholder="Password *"/>
        </div>
    );
}

export default LogInInput;