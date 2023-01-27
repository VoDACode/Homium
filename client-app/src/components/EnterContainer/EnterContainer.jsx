import React from "react";
import cl from './.module.css';

const EnterContainer = ({children}) => {
    return (
        <div className={cl.background}>
            <div className={cl.main}>
                {children}
            </div>
        </div>
    );
}

export default EnterContainer;