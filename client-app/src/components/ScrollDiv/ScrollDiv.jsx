import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

const ScrollDiv = ({ headContent, children, backgroundColor = 'white', width = 'fit-content', height = 'fit-content', padding = '0px', borderSize = '0px', borderColor = 'black', radius = '0px', headerText = '', headerSize = '15px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false }) => {
    return (
        <div style={{ width: 'fit-content' }}>
            <p className={cl.header} style={{
                textAlign: isHeaderCentered ? 'center' : 'left',
                fontSize: headerSize,
                fontWeight: headerWeight,
                color: headerColor
            }}>{headerText}</p>
            <Space size="5px"/>
            <div className={cl.main} style={{
                backgroundColor: backgroundColor,
                borderRadius: radius,
                border: `solid ${borderSize} ${borderColor}`
            }}>
                {headContent}
                <div className={cl.object} style={{ width: width, height: height, padding: padding }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default ScrollDiv;