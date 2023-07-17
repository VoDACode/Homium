import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const Switch = React.forwardRef(({ text = '', textSize = '15px', textWeight = 'normal', checked = false, space = '0px', scale = 1, onChange }, ref) => {
    return (
        <div style={{ transform: `scale(${scale})` }}>
            <p className={cl.header} style={{ fontSize: textSize, fontWeight: textWeight }}>{text}</p>
            <Space height={space} />
            <label className={cl.main}>
                <input className={cl.checkbox} type="checkbox" defaultChecked={checked} onChange={() => { if (onChange) { onChange() } }} ref={ref} />
                <span className={cl.slider}></span>
            </label>
        </div>
    );
});

export default Switch;