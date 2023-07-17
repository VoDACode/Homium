import React, { useRef } from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomCheckbox = ({ name = null, checked = false, text = "", textSize = '15px', textWeight = 'normal', textColor = 'black', scale = "1", space = "10px", onChange }) => {

    const boxRef = useRef();

    const boxScale = {
        msTransform: `scale(${scale})`,
        MozTransform: `scale(${scale})`,
        WebkitTransform: `scale(${scale})`,
        OTransform: `scale(${scale})`,
        transform: `scale(${scale})`
    };

    function changeEvent() {
        onChange(boxRef.current.name, boxRef.current.checked);
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'fit-content'}}>
            <span className={cl.header} style={{ 
                fontSize: textSize, 
                fontWeight: textWeight, 
                color: textColor 
            }}>{text}</span>
            <Space width={space} />
            <input 
                name={name}
                className={cl.box} 
                type='checkbox' 
                checked={checked}
                onChange={() => changeEvent()}
                style={boxScale}
                ref={boxRef} />
        </div>
    );
}

export default CustomCheckbox;