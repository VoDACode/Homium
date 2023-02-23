import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomTextarea = ({ content, contentSize, width, height, headerText, headerSize, headerWeight, headerColor, isHeaderCentered }) => {
    return (
        <div className={cl.main}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize ?? '10px',
                fontWeight: headerWeight ?? 'normal',
                color: headerColor ?? 'black'
            }}>{headerText ?? ''}</p>
            <Space size="5px" />
            <textarea 
                className={cl.cont} 
                defaultValue={content ?? ''}
                style={{
                    width: width ?? '50px', 
                    height: height ?? '50px', 
                    fontSize: contentSize ?? '18px'
            }} />
        </div>
    );
}

export default CustomTextarea;