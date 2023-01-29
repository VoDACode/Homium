import React from "react";
import cl from './.module.css';

const EnterContainer = ({children, backColor}) => {
    return (
        <div className={cl.background} style={{backgroundColor: backColor}}>
            <div className={cl.main}>
                <center>
                    {children}
                </center>
            </div>
        </div>
    );
}

export default EnterContainer;