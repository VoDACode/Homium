import React from "react";

const Space = ({height = "0px", width = "0px"}) => {
    return (
            <div style={{
                height: height,
                width: width}}>
            </div>
    );
}

export default Space;