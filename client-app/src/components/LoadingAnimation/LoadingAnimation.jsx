import React from "react";
import cl from './.module.css';

const LoadingAnimation = ({ size = '120px', loadingCurveWidth = '16px', isCenter = false }) => {

    const centeredStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center' };

    return (
        <div style={isCenter ? centeredStyle : { display: 'block' }}>
            <div className={cl.loader} style={{
            width: size,
            height: size,
            border: `${loadingCurveWidth} solid #d4d4d4`,
            borderTop: `${loadingCurveWidth} solid #3498db`,
            borderBottom: `${loadingCurveWidth} solid #3498db`
            }}></div>
        </div>
    );
}

export default LoadingAnimation;