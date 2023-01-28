import React from "react";
import cl from './.module.css';

const CustomHeader = ({text, textColor}) => {
    return (
        <div>
            <h1 className={cl.header} style={{color: `${textColor || '#000000'}`}}>{text || '...'}</h1>
        </div>
    );
}

export default CustomHeader;