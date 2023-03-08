import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomTextarea = ({ placeholder = '', content = '', contentSize = '18px', width = '50px', height = '50px', headerText = '', headerSize = '10px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false, onChange }) => {
    return (
        <div className={cl.main}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize,
                fontWeight: headerWeight,
                color: headerColor
            }}>{headerText}</p>
            <Space size="5px" />
            <textarea 
                className={cl.cont} 
                onChange={(e) => onChange(e)}
                defaultValue={content}
                placeholder={placeholder}
                style={{
                    width: width, 
                    height: height, 
                    fontSize: contentSize
            }} />
        </div>
    );
}

export default CustomTextarea;