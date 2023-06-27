import React from "react";
import cl from './.module.css';

const CustomHeader = ({text = '...', textColor = '#000000', textSize = '15px', textWeight = '700', wrap = true, border = 'none', borderRadius = '0px', padding = '0px', isCenter = false, autoWidth = true, onClick }) => {
    var center = isCenter ? 'center' : 'left';

    return (
        <div>
            <h1 className={cl.header} 
                onClick={() => {if (onClick) onClick()}}
                style={{color: `${textColor}`,
                        width: autoWidth ? 'auto' : 'fit-content',
                        fontSize: textSize,
                        textAlign: center,
                        fontWeight: textWeight,
                        border: border,
                        borderRadius: borderRadius,
                        padding: padding,
                        whiteSpace: wrap ? 'normal' : 'nowrap'}}>
                            {text}
            </h1>
        </div>
    );
}

export default CustomHeader;