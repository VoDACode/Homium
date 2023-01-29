import React from "react";
import cl from './.module.css';

const SceneContainer = ({children}) => {
    return (
        <div className={cl.main}>
            {children}
        </div>
    );
}

export default SceneContainer;