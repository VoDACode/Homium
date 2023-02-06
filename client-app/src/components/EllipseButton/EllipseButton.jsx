import React from "react";
import cl from './.module.css';

const EllipseButton = ({text, bColor, tColor}) => {
    return (
        <button className={cl.b} style={{
                backgroundColor: bColor || '#000000',
                color: tColor || '#ffffff'
            }}>{text || '...'}</button>
    );
}

export default EllipseButton;