import React from "react";
import cl from './.module.css';

const Switch = ({onChange}) => {
    return (
        <label className={cl.main}>
            <input className={cl.checkbox} type="checkbox" onChange={() => {if (onChange) {onChange()}}}/>
            <span className={cl.slider}></span>
        </label>
    );
}

export default Switch;