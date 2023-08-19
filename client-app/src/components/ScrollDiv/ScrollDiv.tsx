import React from "react";
import Space from "../Space/Space";
import cl from './.module.css';

interface Props {
    idName?: string,
    backgroundColor?: string,
    width?: string,
    height?: string,
    padding?: string,
    borderSize?: string,
    borderColor?: string,
    radius?: string,
    headerText?: string,
    headerSize?: string,
    headerWeight?: string,
    headerColor?: string,
    isHeaderCentered?: boolean,
    headContent?: React.ReactNode,
    children?: React.ReactNode
}

const ScrollDiv = ({ idName = undefined, backgroundColor = 'white', width = '100%', height = 'fit-content', padding = '0px', borderSize = '0px', borderColor = 'black', radius = '0px', headerText = '', headerSize = '15px', headerWeight = 'normal', headerColor = 'black', isHeaderCentered = false, headContent, children }: Props) => {
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