import React from "react";
import cl from './.module.css';

const ModalWindow = ({children, visible}) => {
    var contentVisibility = visible ? "flex" : "none";

    return (
        <div className={cl.back} style={{display: contentVisibility}}>
            <div className={cl.content}>
                {children}
            </div>
        </div>
    );
}

export default ModalWindow;