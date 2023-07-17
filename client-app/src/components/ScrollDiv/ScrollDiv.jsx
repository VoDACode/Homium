import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const ScrollDiv = ({ idName = undefined, backgroundColor = 'white', width = '100%', height = 'fit-content', padding = '0px', borderSize = '0px', borderColor = 'black', radius = '0px', headerText = '', headerSize = '15px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false, headContent, children }) => {
    return (
        <div id={idName} style={{ width: 'fit-content' }}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize,
                fontWeight: headerWeight,
                color: headerColor
            }}>{headerText}</p>
            <Space height="5px"/>
            <div className={cl.main} style={{
                backgroundColor: backgroundColor, 
                width: width, 
                height: height,
                borderRadius: radius,
                border: `solid ${borderSize} ${borderColor}`
            }}>
                {headContent}
                <div className={cl.object} style={{ padding: padding }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ScrollDiv;