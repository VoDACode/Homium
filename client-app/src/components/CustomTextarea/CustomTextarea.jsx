import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const CustomTextarea = ({ placeholder = '', font = '', content = '', contentSize = '18px', width = '50px', height = 'default', maxWidth = 'none', minWidth = 'none', maxHeight = 'none', minHeight = 'none', headerText = '', headerSize = '10px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false, onChange }) => {

    function SetFont() {
        switch (font) {
            case 'robotic':
                return cl.robotic_font;
            default:
                return '';
        }
    }

    return (
        <div className={cl.main} style={{
            maxWidth: maxWidth,
            minWidth: minWidth,
            maxHeight: maxHeight,
            minHeight: minHeight
        }}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize,
                fontWeight: headerWeight,
                color: headerColor
            }}>{headerText}</p>
            <Space size="5px" />
            <textarea
                className={`${cl.cont} ${SetFont()}`}
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