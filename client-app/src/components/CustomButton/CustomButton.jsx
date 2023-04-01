import React from "react";
import cl from './.module.css';

const CustomButton = ({ text = '', isCentered = false, width = '50px', fontSize = '16px', height = '30px', backColor = 'whitesmoke', borderWidth = '1px', borderColor = 'black', onClick }) => {
    return (
        <div className={isCentered ? cl.centered : ''}>
            <button className={cl.b} style={{
                width: width,
                height: height,
                fontSize: fontSize,
                border: `${borderWidth} solid ${borderColor}`,
                backgroundColor: backColor
            }} onClick={onClick}>{text}</button>
        </div>
    );
}

export default CustomButton;