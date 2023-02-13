import React from "react";
import cl from './.module.css';

const Switch = () => {
    return (
        <label className={cl.main}>
            <input className={cl.checkbox} type="checkbox"/>
            <span className={cl.slider}></span>
        </label>
    );
}

export default Switch;