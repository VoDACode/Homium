import React from "react";

const VertSpace = ({h, unit}) => {
    return (<div style={{height: `${h || 0}${unit || 'px'}`}}></div>);
}

export default VertSpace;