import React from "react";
import cl from './.module.css';

const CustomHeader = ({text = '...', textColor = '#000000', textSize = '15px', textWeight = '700', isCenter = false}) => {
    var center = isCenter ? 'center' : 'left';

    return (
        <div>
            <h1 className={cl.header} 
                style={{color: `${textColor}`,
                        fontSize: textSize,
                        textAlign: center,
                        fontWeight: textWeight}}>
                            {text}
            </h1>
        </div>
    );
}

export default CustomHeader;