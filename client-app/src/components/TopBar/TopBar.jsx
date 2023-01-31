import React from "react";
import cl from './.module.css';
import logOutPng from './img/log-out.png';
import settingsPng from './img/settings.png';

const TopBar = () => {
    return (
        <div className={cl.main}>
            <span className={cl.logo}>Homium</span>
            <img className={cl.log_out} src={logOutPng}/>
            <img className={cl.settings} src={settingsPng}/>
        </div>
    );
}

export default TopBar;