import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const Switch = ({ text = '', textSize = '15px', textWeight = 'normal', space = '0px', onChange }) => {
    return (
        <div>
            <p className={cl.header} style={{fontSize: textSize, fontWeight: textWeight}}>{text}</p>
            <Space size={space} />
            <label className={cl.main}>
                <input className={cl.checkbox} type="checkbox" onChange={() => { if (onChange) { onChange() } }} />
                <span className={cl.slider}></span>
            </label>
        </div>
    );
}

export default Switch;