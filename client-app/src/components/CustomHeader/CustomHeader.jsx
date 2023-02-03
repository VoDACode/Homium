import React from "react";
import cl from './.module.css';

const CustomHeader = ({text, textColor, textSize, isCenter}) => {
    var center = isCenter ? 'center' : 'left';

    return (
        <div>
            <h1 className={cl.header} 
                style={{color: `${textColor || '#000000'}`,
                        fontSize: textSize || '7vh',
                        textAlign: center}}>
                            {text || '...'}
            </h1>
        </div>
    );
}

export default CustomHeader;