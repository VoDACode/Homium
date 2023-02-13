import React from "react";

const Space = ({size, isHorizontal}) => {
    return (
            <div style={{
                height: !isHorizontal ? size ?? '0px' : '0px',
                width: isHorizontal ? size ?? '0px' : '0px'}}>
            </div>
    );
}

export default Space;